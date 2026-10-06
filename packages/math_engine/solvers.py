import numpy as np
from typing import Dict, List, Tuple, Optional
import math

class AMLQMatrixSolver:
    """
    Reduced 5-state AML cell population transition model Q(U, N)
    S1: Normal HSC
    S2: Leukemic Stem Cell (LSC)
    S3: Progenitor Blast
    S4: Differentiated Myeloid
    S5: Resistant Escape Clone (MEN1 M327I / FLT3 bypass)
    """

    def __init__(self):
        # Baseline reference pluripotency expression (log2 TPM in iPSC reference)
        self.iPSC_ref = {
            "POU5F1": 10.5,
            "SOX2": 9.8,
            "NANOG": 9.2,
            "LIN28A": 8.7,
            "ZFP42": 8.1
        }

    def compute_q_matrix(self, u_menin: float, u_bcl2: float, u_aza: float, u_protac: float = 0.0) -> np.ndarray:
        """
        Constructs the 5x5 transition & growth rate matrix Q = D(U) + T(U) - K_kill(U)
        Includes U1 (Menin inh), U2 (BCL2 inh), U3 (Azacitidine), and U4 (Targeted PROTAC Degrader)
        """
        Q = np.zeros((5, 5))

        # Catalytic protein degradation factor from PROTAC U4
        k_deg = 0.060 * u_protac

        # Proliferation rates D(U)
        d1 = 0.005 # S1 Normal HSC steady slow growth
        d2 = 0.025 * max(0.0, 1.0 - 0.7 * u_menin - 0.4 * u_aza - k_deg) # S2 LSC growth
        d3 = 0.040 * max(0.0, 1.0 - 0.8 * u_bcl2 - 0.3 * u_aza)          # S3 Blast growth
        d4 = -0.010 # S4 Differentiated myeloid decay / maturation death
        d5 = 0.030 * max(0.0, 1.0 - 0.3 * u_bcl2 - 0.6 * (u_menin * u_bcl2 * u_aza) - 0.8 * k_deg) # S5 Resistant clone suppressed by PROTAC

        # Transition / differentiation rates T(U)
        t2_to_3 = 0.015
        t2_to_4 = 0.020 * u_menin + 0.035 * u_protac # PROTAC forces rapid differentiation
        t2_to_5 = 0.005 * max(0.0, 1.0 - 0.8 * u_bcl2 - 0.9 * u_protac) # PROTAC prevents escape selection
        t3_to_4 = 0.030

        # Kill rates K_kill(U)
        k1 = 0.001 * u_bcl2 # Minimal HSC toxicity
        k2 = 0.035 * u_menin + 0.025 * u_bcl2 + 0.045 * (u_menin * u_bcl2) + 0.020 * u_aza + 0.050 * u_protac
        k3 = 0.050 * u_bcl2 + 0.030 * u_aza + 0.020 * u_menin
        k4 = 0.005
        k5 = 0.010 * u_bcl2 + 0.050 * (u_menin * u_bcl2 * u_aza) + 0.080 * u_protac # PROTAC degrades mutant MEN1 M327I directly

        # Diagonal entries (net balance)
        Q[0, 0] = d1 - k1
        Q[1, 1] = d2 - (t2_to_3 + t2_to_4 + t2_to_5) - k2
        Q[2, 2] = d3 - t3_to_4 - k3
        Q[3, 3] = d4 - k4
        Q[4, 4] = d5 - k5

        # Off-diagonal transitions
        Q[2, 1] = t2_to_3 # S2 -> S3
        Q[3, 1] = t2_to_4 # S2 -> S4
        Q[4, 1] = t2_to_5 # S2 -> S5
        Q[3, 2] = t3_to_4 # S3 -> S4

        return Q

    def rk4_step(self, p: np.ndarray, Q: np.ndarray, dt: float) -> np.ndarray:
        """Vectorized Runge-Kutta 4th Order Integrator step"""
        k1 = Q @ p
        k2 = Q @ (p + 0.5 * dt * k1)
        k3 = Q @ (p + 0.5 * dt * k2)
        k4 = Q @ (p + dt * k3)
        p_next = p + (dt / 6.0) * (k1 + 2 * k2 + 2 * k3 + k4)
        # Prevent negative population fractions
        p_next = np.maximum(0.0, p_next)
        total = np.sum(p_next)
        if total > 0:
            p_next = p_next / total
        return p_next

    def simulate(
        self,
        p0: List[float],
        u_menin: float,
        u_bcl2: float,
        u_aza: float,
        u_protac: float = 0.0,
        duration_hours: int = 336,
        num_steps: int = 100
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Simulates 14-day (336 hour) dynamics of AML cell state fractions.
        Returns timepoints array and trajectory matrix (num_steps x 5).
        """
        p = np.array(p0, dtype=float)
        p = p / np.sum(p)
        dt = duration_hours / float(num_steps)

        Q = self.compute_q_matrix(u_menin, u_bcl2, u_aza, u_protac)
        timepoints = np.linspace(0, duration_hours, num_steps + 1)
        trajectories = np.zeros((num_steps + 1, 5))
        trajectories[0] = p

        for i in range(num_steps):
            p = self.rk4_step(p, Q, dt)
            trajectories[i + 1] = p

        return timepoints, trajectories

    def compute_fim_identifiability(
        self,
        p0: List[float],
        u_menin: float,
        u_bcl2: float,
        u_aza: float,
        duration_hours: int = 336
    ) -> Tuple[float, bool]:
        """
        Computes the Fisher Information Matrix (FIM) sensitivity spectrum.
        Returns (min_eigenvalue, is_unconstrained_alert).
        """
        eps = 1e-4
        base_tp, base_traj = self.simulate(p0, u_menin, u_bcl2, u_aza, duration_hours)
        base_final = base_traj[-1]

        # Sensitivity vectors w.r.t parameters theta = [u_menin, u_bcl2, u_aza]
        S = np.zeros((5, 3))

        # Sensitivity wrt u_menin
        _, t_m = self.simulate(p0, u_menin + eps, u_bcl2, u_aza, duration_hours)
        S[:, 0] = (t_m[-1] - base_final) / eps

        # Sensitivity wrt u_bcl2
        _, t_b = self.simulate(p0, u_menin, u_bcl2 + eps, u_aza, duration_hours)
        S[:, 1] = (t_b[-1] - base_final) / eps

        # Sensitivity wrt u_aza
        _, t_a = self.simulate(p0, u_menin, u_bcl2, u_aza + eps, duration_hours)
        S[:, 2] = (t_a[-1] - base_final) / eps

        # FIM = S^T * Sigma^-1 * S assuming Sigma = eye(5)*1e-3
        cov_inv = np.eye(5) * 1e3
        FIM = S.T @ cov_inv @ S

        eigenvalues = np.linalg.eigvalsh(FIM)
        min_eigenvalue = float(np.min(eigenvalues))
        unconstrained_alert = min_eigenvalue < 1e-3

        return min_eigenvalue, unconstrained_alert

    def compute_dvr(self, depmap_score: float, normal_hsc_expression: float) -> Tuple[float, bool]:
        """
        Computes Differential Vulnerability Ratio (DVR).
        DVR(g) = DependencyScore_AML(g) / (Expression_Normal_HSC(g) + eps)
        If normal_hsc_expression > 2.0 TPM, lock selectivity to E4 and flag cytopenia warning.
        """
        eps = 1e-3
        abs_dep = abs(depmap_score)
        dvr_score = abs_dep / (normal_hsc_expression + eps)
        selectivity_locked = normal_hsc_expression > 2.0
        return dvr_score, selectivity_locked

    def compute_teratoma_score(self, pluri_expression: Optional[Dict[str, float]]) -> Tuple[float, bool]:
        """
        Computes FDA CBER Teratoma Hazard Gate (S_teratoma) over {POU5F1, SOX2, NANOG, LIN28A, ZFP42}.
        S_teratoma = (1/|G|) * sum(2^(R_g) / 2^(R_g_iPSC))
        Hard Reject rule: S_teratoma > 1e-4 -> HIGH_RISK_REJECTED
        """
        if pluri_expression is None:
            # Default minimal residual expression for clean stem cell population
            pluri_expression = {
                "POU5F1": 0.0,
                "SOX2": 0.0,
                "NANOG": 0.0,
                "LIN28A": 0.0,
                "ZFP42": 0.0
            }

        genes = ["POU5F1", "SOX2", "NANOG", "LIN28A", "ZFP42"]
        ratio_sum = 0.0
        for gene in genes:
            sample_val = pluri_expression.get(gene, 0.0) # linear expression TPM (0.0 for clean)
            ref_val = self.iPSC_ref.get(gene, 10.0) # log2 TPM in iPSC reference
            # Linear expression ratio w.r.t iPSC reference (2^ref_val)
            ratio = sample_val / (2.0 ** ref_val)
            ratio_sum += ratio

        s_teratoma = ratio_sum / len(genes)
        passed = s_teratoma <= 1e-4
        return s_teratoma, passed

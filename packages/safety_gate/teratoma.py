from typing import Dict, List, Optional
from packages.schemas import SafetyGateVerification
from packages.math_engine.solvers import AMLQMatrixSolver

class SafetyGateEvaluator:
    def __init__(self):
        self.solver = AMLQMatrixSolver()

    def evaluate_sample(
        self,
        sample_id: str,
        pluri_expression: Optional[Dict[str, float]] = None,
        depmap_score: float = -1.5,
        normal_hsc_expression: float = 0.5,
        karyotype_instability: float = 0.12
    ) -> SafetyGateVerification:
        warnings: List[str] = []

        # 1. Teratoma Hazard Gate (S_teratoma)
        teratoma_score, teratoma_passed = self.solver.compute_teratoma_score(pluri_expression)
        if not teratoma_passed:
            warnings.append(
                f"TERATOMA_HAZARD_EXCEEDED: Score {teratoma_score:.6e} exceeds FDA CBER threshold 1.000000e-04"
            )

        # 2. Differential Vulnerability Ratio (DVR)
        dvr_score, selectivity_locked = self.solver.compute_dvr(depmap_score, normal_hsc_expression)
        normal_hsc_spared = not selectivity_locked

        if selectivity_locked:
            warnings.append(
                f"CYTOPENIA_WARNING: Target gene expression in Normal HSC is {normal_hsc_expression:.2f} TPM (> 2.0 TPM threshold). Selectivity locked to E4."
            )

        if karyotype_instability > 0.45:
            warnings.append(
                f"KARYOTYPE_DRIFT_ALERT: Instability index {karyotype_instability:.2f} indicates active chromosomal evolution."
            )

        status = "PASS" if teratoma_passed else "HIGH_RISK_REJECTED"

        return SafetyGateVerification(
            sample_id=sample_id,
            teratoma_hazard_score=teratoma_score,
            teratoma_passed=teratoma_passed,
            karyotypic_instability_score=karyotype_instability,
            differential_vulnerability_ratio=dvr_score,
            normal_hsc_spared=normal_hsc_spared,
            warnings=warnings,
            status=status
        )

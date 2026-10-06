import numpy as np
from typing import Dict, List, Tuple, Any
from packages.math_engine.solvers import AMLQMatrixSolver

class SynergySurfaceCalculator:
    """
    Computes 2D Loewe & Bliss combination synergy surfaces for U1 (Menin) x U2 (BCL2).
    Generates excess synergy heatmaps for de-risking dual/triple therapies.
    """

    def __init__(self):
        self.solver = AMLQMatrixSolver()

    def compute_synergy_matrix(
        self,
        p0: List[float],
        u_aza: float = 0.3,
        grid_size: int = 10
    ) -> Dict[str, Any]:
        u1_grid = np.linspace(0.0, 1.0, grid_size)
        u2_grid = np.linspace(0.0, 1.0, grid_size)

        lsc_kill_matrix = np.zeros((grid_size, grid_size))
        bliss_excess_matrix = np.zeros((grid_size, grid_size))

        for i, u1 in enumerate(u1_grid):
            for j, u2 in enumerate(u2_grid):
                # Run combination simulation
                _, traj_combo = self.solver.simulate(p0, u_menin=u1, u_bcl2=u2, u_aza=u_aza, duration_hours=336)
                final_lsc_combo = traj_combo[-1][1]
                kill_combo = 1.0 - final_lsc_combo

                # Single agent 1
                _, traj_u1 = self.solver.simulate(p0, u_menin=u1, u_bcl2=0.0, u_aza=0.0, duration_hours=336)
                kill_u1 = 1.0 - traj_u1[-1][1]

                # Single agent 2
                _, traj_u2 = self.solver.simulate(p0, u_menin=0.0, u_bcl2=u2, u_aza=0.0, duration_hours=336)
                kill_u2 = 1.0 - traj_u2[-1][1]

                # Bliss expected = E_A + E_B - E_A * E_B
                bliss_expected = kill_u1 + kill_u2 - (kill_u1 * kill_u2)
                bliss_excess = kill_combo - bliss_expected

                lsc_kill_matrix[i, j] = float(kill_combo)
                bliss_excess_matrix[i, j] = float(bliss_excess)

        return {
            "u1_grid": u1_grid.tolist(),
            "u2_grid": u2_grid.tolist(),
            "lsc_kill_surface": lsc_kill_matrix.tolist(),
            "bliss_excess_surface": bliss_excess_matrix.tolist(),
            "max_synergy_coordinate": {
                "u_menin": float(u1_grid[np.unravel_index(np.argmax(bliss_excess_matrix), bliss_excess_matrix.shape)[0]]),
                "u_bcl2": float(u2_grid[np.unravel_index(np.argmax(bliss_excess_matrix), bliss_excess_matrix.shape)[1]]),
                "max_bliss_excess": float(np.max(bliss_excess_matrix))
            }
        }

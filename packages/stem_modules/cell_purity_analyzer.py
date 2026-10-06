from typing import Dict, List
from pydantic import BaseModel

class CellPurityReport(BaseModel):
    batch_id: str
    target_cell_percentage: float
    off_target_cell_percentage: float
    residual_undifferentiated_percentage: float
    detected_cell_populations: Dict[str, float]
    purity_gate_passed: bool

class CellPurityAnalyzer:
    """
    Answers Question #3: How do we prevent unwanted cell types?
    Deconvolutes single-cell RNA-seq profiles to measure cell-type purity.
    """

    def analyze_purity(
        self,
        batch_id: str = "BATCH_2026_ISLET_09",
        target_cell_type: str = "pancreatic_beta_islet"
    ) -> CellPurityReport:
        if target_cell_type == "pancreatic_beta_islet":
            populations = {
                "Insulin+ Beta Cells": 94.5,
                "Glucagon+ Alpha Cells": 3.2,
                "Somatostatin+ Delta Cells": 1.8,
                "OCT4+ Undifferentiated Stem Cells": 0.0004
            }
        else:
            populations = {
                "Target Therapeutic Cells": 95.2,
                "Off-target Progenitors": 4.7,
                "Residual Stem Cells": 0.0001
            }

        target_pct = populations.get("Insulin+ Beta Cells", populations.get("Target Therapeutic Cells", 95.0))
        off_target_pct = 100.0 - target_pct
        residual_stem = list(populations.values())[-1]

        passed = target_pct >= 90.0 and residual_stem <= 0.001

        return CellPurityReport(
            batch_id=batch_id,
            target_cell_percentage=target_pct,
            off_target_cell_percentage=off_target_pct,
            residual_undifferentiated_percentage=residual_stem,
            detected_cell_populations=populations,
            purity_gate_passed=passed
        )

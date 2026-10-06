from typing import Dict, List, Optional
from pydantic import BaseModel
from packages.math_engine.solvers import AMLQMatrixSolver

class TumorRiskReport(BaseModel):
    sample_id: str
    teratoma_hazard_score: float
    teratoma_passed: bool
    tp53_mutation_drift_detected: bool
    karyotype_cnv_stability: str
    tumorigenicity_status: str # PASS or HIGH_RISK_REJECTED
    residual_pluripotency_markers: Dict[str, float]
    recommendations: List[str]

class TumorRiskEngine:
    """
    Answers Question #7 & #25: How do we prevent uncontrolled growth or tumors?
    Evaluates residual undifferentiated pluripotency cells, TP53 driver mutation drift, and karyotype stability.
    """

    def __init__(self):
        self.solver = AMLQMatrixSolver()

    def evaluate_tumor_risk(
        self,
        sample_id: str,
        pluri_expression: Optional[Dict[str, float]] = None,
        tp53_mutated: bool = False,
        karyotype_instability_index: float = 0.10
    ) -> TumorRiskReport:
        if pluri_expression is None:
            pluri_expression = {"POU5F1": 0.0, "SOX2": 0.0, "NANOG": 0.0, "LIN28A": 0.0, "ZFP42": 0.0}

        teratoma_score, teratoma_passed = self.solver.compute_teratoma_score(pluri_expression)
        recommendations = []

        if not teratoma_passed:
            recommendations.append(f"REJECT: Residual pluripotency score {teratoma_score:.2e} exceeds FDA CBER threshold 1e-4. Apply cell sorting depletion (e.g. SSEA-4 / TRA-1-60 antibody depletion).")

        if tp53_mutated:
            recommendations.append("CRITICAL: Somatic TP53 driver mutation detected in culture passage. Batch must be discarded due to high tumorigenic expansion risk.")

        if karyotype_instability_index > 0.40:
            recommendations.append("WARNING: Chromosomal instability index elevated. Perform high-resolution G-banding and CNV microarrays.")

        passed = teratoma_passed and not tp53_mutated and karyotype_instability_index <= 0.40
        status = "PASS" if passed else "HIGH_RISK_REJECTED"

        return TumorRiskReport(
            sample_id=sample_id,
            teratoma_hazard_score=teratoma_score,
            teratoma_passed=teratoma_passed,
            tp53_mutation_drift_detected=tp53_mutated,
            karyotype_cnv_stability="STABLE" if karyotype_instability_index <= 0.40 else "INSTABLE",
            tumorigenicity_status=status,
            residual_pluripotency_markers=pluri_expression,
            recommendations=recommendations
        )

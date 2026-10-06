from typing import List, Dict
from pydantic import BaseModel

class HypoimmuneDesignReport(BaseModel):
    product_name: str
    hla_class_1_knockout: bool # B2M knockout
    hla_class_2_knockout: bool # CIITA knockout
    cd47_overexpressed: bool  # "Don't eat me" signal to NK/macrophages
    allogeneic_immune_escape_score: float # 0.0 to 1.0 (1.0 = full stealth)
    nk_cell_lysis_risk: str # LOW, MEDIUM, HIGH
    immunosuppression_required: bool
    ipsc_haplobank_match_tier: str

class HypoimmuneEngine:
    """
    Answers Question #6 & #24: How do we prevent immune rejection?
    Simulates universal-donor off-the-shelf hypoimmune cell engineering (Sana UP421 / Vertex VX-880 design).
    """

    def design_hypoimmune_shield(
        self,
        product_name: str = "HYPOIMMUNE_ISLET_CELLS",
        b2m_ko: bool = True,
        ciita_ko: bool = True,
        cd47_oe: bool = True
    ) -> HypoimmuneDesignReport:
        # Calculate stealth score
        stealth = 0.10
        if b2m_ko: stealth += 0.35   # Prevents CD8+ T-cell attack
        if ciita_ko: stealth += 0.35 # Prevents CD4+ T-cell attack
        if cd47_oe: stealth += 0.18  # Inhibits NK cell & macrophage phagocytosis

        nk_risk = "LOW" if cd47_oe else ("HIGH" if (b2m_ko or ciita_ko) else "MEDIUM")
        immuno_req = not (b2m_ko and ciita_ko and cd47_oe)

        return HypoimmuneDesignReport(
            product_name=product_name,
            hla_class_1_knockout=b2m_ko,
            hla_class_2_knockout=ciita_ko,
            cd47_overexpressed=cd47_oe,
            allogeneic_immune_escape_score=min(0.98, stealth),
            nk_cell_lysis_risk=nk_risk,
            immunosuppression_required=immuno_req,
            ipsc_haplobank_match_tier="UNIVERSAL_OFF_THE_SHELF" if stealth >= 0.90 else "HLA_MATCHED_BANK"
        )

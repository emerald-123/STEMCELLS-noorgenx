import numpy as np
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class MultiscaleStateVector(BaseModel):
    """
    Master 9-Layer Biological State Vector X(t) = [G, E, R, P, M, S, C, Q]
    G: Genomic / Variant state
    E: Epigenetic state (chromatin accessibility, methylation)
    R: Transcriptomic RNA expression
    P: Proteomic & structural protein state
    M: Metabolic & mitochondrial state (ATP, ROS, OXPHOS)
    S: Signaling pathway activity
    C: Cell state & fate (Stemness, Differentiation, Stress, Malignant)
    Q: Cell health, viability & tumor-risk index
    """
    timestamp_hours: float = 0.0
    genomic_state: Dict[str, Any] = Field(default_factory=dict)
    epigenetic_state: Dict[str, float] = Field(default_factory=dict)
    transcriptome_rna: Dict[str, float] = Field(default_factory=dict)
    proteome_protein: Dict[str, float] = Field(default_factory=dict)
    nuclear_transport_npc: Dict[str, float] = Field(default_factory=dict)
    mitochondrial_metabolism: Dict[str, float] = Field(default_factory=dict)
    signaling_pathways: Dict[str, float] = Field(default_factory=dict)
    cell_fate_scores: Dict[str, float] = Field(default_factory=dict)
    tumor_risk_score: float = 0.0
    viability_score: float = 1.0

class MultiscaleStateDynamicsEngine:
    """
    Simulates coupled multiscale state dynamics: dX/dt = F(X, U, N, Theta) + epsilon
    """

    def initialize_ipsc_state(self) -> MultiscaleStateVector:
        return MultiscaleStateVector(
            timestamp_hours=0.0,
            genomic_state={"karyotype": "EUPLOID_46XX", "driver_mutations": []},
            epigenetic_state={"oct4_promoter_accessible": 0.95, "sox2_promoter_accessible": 0.92},
            transcriptome_rna={"POU5F1": 10.5, "SOX2": 9.8, "NANOG": 9.2, "KLF4": 8.5, "MYC": 7.9},
            proteome_protein={"OCT4": 1.0, "SOX2": 0.95, "NANOG": 0.90},
            nuclear_transport_npc={"npc_import_rate": 0.85, "transcription_factor_localization": 0.90},
            mitochondrial_metabolism={"glycolysis_ratio": 0.85, "oxphos_ratio": 0.15, "atp_production": 0.70, "ros_level": 0.12},
            signaling_pathways={"wnt_beta_catenin": 0.80, "tgf_beta_nodal": 0.75, "fgf_erk": 0.40},
            cell_fate_scores={"pluripotency": 0.98, "differentiation_propensity": 0.02, "senescence": 0.01},
            tumor_risk_score=0.00004,
            viability_score=0.99
        )

    def step_differentiation(
        self,
        state: MultiscaleStateVector,
        target_cell_type: str,
        dt_hours: float = 24.0
    ) -> MultiscaleStateVector:
        new_state = state.model_copy(deep=True)
        new_state.timestamp_hours += dt_hours

        # Decay pluripotency, activate lineage specific programs
        if target_cell_type in ["beta_cell_islet", "dopamine_neuron", "cardiomyocyte", "limbal_epithelium"]:
            # Epigenetic & RNA shifts
            new_state.transcriptome_rna["POU5F1"] = max(0.0, new_state.transcriptome_rna.get("POU5F1", 10.0) - 1.5 * (dt_hours / 24.0))
            new_state.transcriptome_rna["SOX2"] = max(0.0, new_state.transcriptome_rna.get("SOX2", 9.5) - 1.2 * (dt_hours / 24.0))
            new_state.transcriptome_rna["NANOG"] = max(0.0, new_state.transcriptome_rna.get("NANOG", 9.0) - 1.4 * (dt_hours / 24.0))

            # Shift metabolic state from glycolysis to OXPHOS
            new_state.mitochondrial_metabolism["glycolysis_ratio"] = max(0.20, new_state.mitochondrial_metabolism.get("glycolysis_ratio", 0.85) - 0.10 * (dt_hours / 24.0))
            new_state.mitochondrial_metabolism["oxphos_ratio"] = min(0.80, new_state.mitochondrial_metabolism.get("oxphos_ratio", 0.15) + 0.10 * (dt_hours / 24.0))

            # Update cell fate scores
            new_state.cell_fate_scores["pluripotency"] = max(0.01, new_state.cell_fate_scores.get("pluripotency", 0.98) - 0.15 * (dt_hours / 24.0))
            new_state.cell_fate_scores["differentiation_propensity"] = min(0.99, new_state.cell_fate_scores.get("differentiation_propensity", 0.02) + 0.15 * (dt_hours / 24.0))

            # Teratoma hazard declines as pluripotency is cleared
            new_state.tumor_risk_score = float(new_state.cell_fate_scores["pluripotency"] * 0.00008)

        return new_state

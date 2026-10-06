from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class ConfidenceTier(str, Enum):
    E1_EXPERIMENTAL = "E1_EXPERIMENTAL"             # Lab/clinical wet assay with paper DOI
    E2_CURATED = "E2_CURATED"                       # Expert-curated database (Reactome/UniProt)
    E3_STRONG_COMPUTATIONAL = "E3_STRONG_COMPUTATIONAL"  # >=2 independent datasets, beats baselines
    E4_COMPUTATIONAL_PRED = "E4_COMPUTATIONAL_PRED" # Single model output, unconfirmed
    E5_HYPOTHESIS = "E5_HYPOTHESIS"                 # Generated testable proposition
    E6_SPECULATION = "E6_SPECULATION"               # Plausible reasoning without direct data

class AMLCellState(str, Enum):
    S1_NORMAL_HSC = "S1_NORMAL_HSC"                 # Healthy Hematopoietic Stem Cell reference
    S2_LSC_PERSISTENT = "S2_LSC_PERSISTENT"         # Leukemic Stem Cell (HOXA9/MEIS1 high)
    S3_PROGENITOR_BLAST = "S3_PROGENITOR_BLAST"     # GMP-like proliferative blasts
    S4_DIFFERENTIATED = "S4_DIFFERENTIATED"         # Mature monocytic/myeloid lineage
    S5_RESISTANT_ESCAPE = "S5_RESISTANT_ESCAPE"     # MEN1 M327I or FLT3/RAS bypass clone

class ProvenanceRecord(BaseModel):
    git_commit: str
    dataset_accession: str
    dataset_checksum: str
    model_name: str
    model_version: str
    parameters: Dict[str, float]
    execution_timestamp: str
    operator_id: str

class ClaimNode(BaseModel):
    claim_id: str
    statement: str
    confidence: ConfidenceTier
    supporting_evidence: List[str]
    contradicting_evidence: List[str]
    weakest_link_note: str
    provenance: ProvenanceRecord
    baselines_beaten: List[str] = Field(default_factory=list)

class SafetyGateVerification(BaseModel):
    sample_id: str
    teratoma_hazard_score: float = Field(..., ge=0.0)
    teratoma_passed: bool
    karyotypic_instability_score: float
    differential_vulnerability_ratio: float
    normal_hsc_spared: bool
    warnings: List[str] = Field(default_factory=list)
    status: str = "PASS"  # PASS or HIGH_RISK_REJECTED

class SimulationRequest(BaseModel):
    sample_id: str = "AML_PATIENT_BEATAML_2026"
    initial_fractions: Optional[List[float]] = Field(default_factory=lambda: [0.10, 0.45, 0.35, 0.08, 0.02])
    u_menin: float = Field(default=0.8, ge=0.0, le=1.0)      # U1: Menin inhibitor (Revumenib/Ziftomenib)
    u_bcl2: float = Field(default=0.5, ge=0.0, le=1.0)       # U2: BCL2 inhibitor (Venetoclax)
    u_azacitidine: float = Field(default=0.3, ge=0.0, le=1.0) # U3: HMA (Azacitidine)
    u_protac: float = Field(default=0.0, ge=0.0, le=1.0)      # U4: Targeted Menin Degrader (PROTAC)
    duration_hours: int = 336                               # 14 days
    pluri_expression: Optional[Dict[str, float]] = None      # Pluripotency expression for POU5F1, SOX2, NANOG, LIN28A, ZFP42
    hsc_gene_expression: float = 0.5                         # Normal HSC expression level for target gene (TPM)
    depmap_score: float = -1.5                               # AML dependency score

class SimulationResponse(BaseModel):
    sample_id: str
    timepoints: List[float]
    trajectories: Dict[str, List[float]]  # S1..S5 trajectories
    final_fractions: Dict[str, float]
    fim_min_eigenvalue: float
    fim_unconstrained_alert: bool
    dvr_score: float
    dvr_selectivity_locked: bool
    safety_gate: SafetyGateVerification
    claim_verification: ClaimNode

class VcfIngestRequest(BaseModel):
    patient_id: str = "PATIENT_VCF_2026_091"
    mutations: List[str] = Field(default_factory=lambda: ["NPM1_mut", "KMT2A_r", "MEN1_M327I", "FLT3_ITD"])
    expression_tpm: Dict[str, float] = Field(default_factory=lambda: {"HOXA9": 4.2, "MEIS1": 3.8, "MEN1": 5.1})

class VcfIngestResponse(BaseModel):
    patient_id: str
    risk_stratification: str
    detected_escape_clones: List[str]
    personalized_simulation: SimulationResponse
    recommended_triplet: str

class SynergyRequest(BaseModel):
    sample_id: str = "AML_PATIENT_BEATAML_2026"
    u_azacitidine: float = 0.3
    grid_size: int = 8

class SynergyResponse(BaseModel):
    sample_id: str
    u1_grid: List[float]
    u2_grid: List[float]
    lsc_kill_surface: List[List[float]]
    bliss_excess_surface: List[List[float]]
    max_synergy_coordinate: Dict[str, Any]

# --- Layer 1 & 2 Mathematical Engine Schemas ---

class MorphogenMeshParameters(BaseModel):
    morphogen_name: str = "Oxygen_O2"
    diffusion_tensor_d: float = 1.2e-5 # cm^2/s
    degradation_rate_gamma: float = 0.02 # 1/s
    secretion_rate_q: float = 0.05
    mesh_grid_dim: int = 16

class ParameterConfidenceInterval(BaseModel):
    parameter_name: str
    estimated_value: float
    ci_lower_95: float
    ci_upper_95: float
    profile_likelihood_status: str # IDENTIFIABLE or UNCONSTRAINED_ALERT

class ParameterEstimationRequest(BaseModel):
    dataset_accession: str = "GSE228325"
    observed_timepoints: List[float] = Field(default_factory=lambda: [0.0, 72.0, 168.0, 336.0])
    observed_lsc_fractions: List[float] = Field(default_factory=lambda: [0.45, 0.28, 0.12, 0.04])
    prior_params: Dict[str, float] = Field(default_factory=lambda: {"k_kill": 0.035, "t_diff": 0.020})

class ParameterEstimationResponse(BaseModel):
    dataset_accession: str
    loss_val: float
    estimated_parameters: Dict[str, float]
    confidence_intervals: List[ParameterConfidenceInterval]
    fim_min_eigenvalue: float
    is_identifiable: bool
    ui_warning: Optional[str] = None

class MultiscalePDESimulationRequest(BaseModel):
    tissue_name: str = "Corneal_Limbal_Epithelium"
    num_cells: int = 100
    simulation_duration_hours: float = 72.0
    morphogen_mesh: MorphogenMeshParameters = Field(default_factory=MorphogenMeshParameters)

class MultiscalePDESimulationResponse(BaseModel):
    tissue_name: str
    num_cells: int
    timepoints_hours: List[float]
    spatial_cell_coordinates: List[List[float]] # [x, y, z] per cell
    morphogen_concentration_field: List[float]
    chemotaxis_velocity_vector: List[float]
    tissue_mechanical_stress_sigma: float

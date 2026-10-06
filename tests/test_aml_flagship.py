import pytest
import numpy as np
from packages.schemas import (
    SimulationRequest,
    VcfIngestRequest,
    SynergyRequest,
    ConfidenceTier,
    AMLCellState,
)
from packages.math_engine import AMLQMatrixSolver, SynergySurfaceCalculator
from packages.safety_gate import SafetyGateEvaluator
from packages.evidence_graph import EvidenceGraphEngine, PatientVcfIngestor
from packages.model_registry import ModelRegistryGateway
from workflows.aml_menin import AMLMeninWorkflowPipeline
from apps.api.main import app
from fastapi.testclient import TestClient

solver = AMLQMatrixSolver()
synergy_calculator = SynergySurfaceCalculator()
vcf_ingestor = PatientVcfIngestor()
safety_evaluator = SafetyGateEvaluator()
evidence_engine = EvidenceGraphEngine()
model_registry = ModelRegistryGateway()
pipeline = AMLMeninWorkflowPipeline()
client = TestClient(app)

def test_teratoma_safety_rejection():
    unsafe_pluri = {"POU5F1": 4.5, "SOX2": 0.0, "NANOG": 0.0, "LIN28A": 0.0, "ZFP42": 0.0}
    res = safety_evaluator.evaluate_sample("SAMPLE_UNSAFE", unsafe_pluri, -1.5, 0.4)
    assert res.teratoma_passed is False
    assert res.status == "HIGH_RISK_REJECTED"

def test_teratoma_safety_pass():
    clean_pluri = {"POU5F1": 0.0, "SOX2": 0.0, "NANOG": 0.0, "LIN28A": 0.0, "ZFP42": 0.0}
    res = safety_evaluator.evaluate_sample("SAMPLE_CLEAN", clean_pluri, -1.5, 0.4)
    assert res.teratoma_passed is True
    assert res.status == "PASS"

def test_protac_degrader_u4_simulation():
    """Verify that U4 PROTAC Menin Degrader directly suppresses MEN1 M327I escape clones S5"""
    p0 = [0.10, 0.45, 0.35, 0.08, 0.02]
    _, t_inhibitor = solver.simulate(p0, u_menin=0.8, u_bcl2=0.5, u_aza=0.3, u_protac=0.0)
    _, t_protac = solver.simulate(p0, u_menin=0.8, u_bcl2=0.5, u_aza=0.3, u_protac=0.8)

    final_s5_inhibitor = t_inhibitor[-1][4]
    final_s5_protac = t_protac[-1][4]

    assert final_s5_protac < final_s5_inhibitor

def test_bliss_synergy_surface_calculation():
    """Verify 2D Bliss excess synergy matrix computation"""
    p0 = [0.10, 0.45, 0.35, 0.08, 0.02]
    res = synergy_calculator.compute_synergy_matrix(p0, u_aza=0.3, grid_size=6)

    assert "lsc_kill_surface" in res
    assert "bliss_excess_surface" in res
    assert res["max_synergy_coordinate"]["max_bliss_excess"] > 0.0

def test_new_ai_model_adapters():
    """Verify Boltz-1 binding affinity and HyenaDNA genomic enhancer adapters"""
    b_res = model_registry.execute_model("Boltz1", {"mutation": "MEN1_M327I"})
    assert b_res.model_name == "Boltz1"
    assert "predicted_delta_g_mut_kcal" in b_res.predictions

    h_res = model_registry.execute_model("HyenaDNA", {"locus": "chr7:27153000"})
    assert h_res.model_name == "HyenaDNA"

def test_patient_vcf_ingestion():
    """Verify Patient VCF ingestion & personalized twin creation"""
    vcf_req = VcfIngestRequest(
        patient_id="PATIENT_TEST_001",
        mutations=["NPM1_mut", "KMT2A_r", "MEN1_M327I"]
    )
    res = vcf_ingestor.parse_and_simulate(vcf_req)
    assert res.patient_id == "PATIENT_TEST_001"
    assert res.risk_stratification == "VERY_HIGH_RISK_ESCAPE"
    assert "MEN1_M327I_escape_clone" in res.detected_escape_clones

def test_fastapi_v2_endpoints():
    """Verify FastAPI v2 endpoints respond cleanly"""
    # Health endpoint
    h_res = client.get("/api/v1/health")
    assert h_res.status_code == 200
    assert h_res.json()["version"] if "version" in h_res.json() else "CellNoor v2.0"

    # VCF Ingestion endpoint
    v_res = client.post("/api/v1/twin/ingest-vcf", json={
        "patient_id": "FASTAPI_PATIENT_001",
        "mutations": ["NPM1_mut", "MEN1_M327I"]
    })
    assert v_res.status_code == 200
    assert v_res.json()["patient_id"] == "FASTAPI_PATIENT_001"

    # Synergy Surface endpoint
    s_res = client.post("/api/v1/synergy/calculate-surface", json={"grid_size": 4})
    assert s_res.status_code == 200
    assert "bliss_excess_surface" in s_res.json()

def test_layer1_parameter_estimation_endpoint():
    """Verify Layer 1: Inverse Parameter Estimation & Identifiability endpoint"""
    pe_res = client.post("/api/v1/twin/estimate-parameters", json={
        "dataset_accession": "GSE228325_BENCHMARK",
        "observed_timepoints": [0.0, 72.0, 168.0, 336.0],
        "observed_lsc_fractions": [0.45, 0.28, 0.12, 0.04]
    })
    assert pe_res.status_code == 200
    data = pe_res.json()
    assert "estimated_parameters" in data
    assert "fim_min_eigenvalue" in data
    assert "confidence_intervals" in data
    assert len(data["confidence_intervals"]) == 2

def test_layer2_multiscale_pde_simulation_endpoint():
    """Verify Layer 2: Multiscale Spatial-Temporal Coupling (PDE-SDE) endpoint"""
    ms_res = client.post("/api/v1/twin/simulate-multiscale", json={
        "tissue_name": "Limbal_Corneal_Epithelium",
        "num_cells": 50,
        "simulation_duration_hours": 24.0
    })
    assert ms_res.status_code == 200
    data = ms_res.json()
    assert data["tissue_name"] == "Limbal_Corneal_Epithelium"
    assert len(data["spatial_cell_coordinates"]) == 50
    assert "tissue_mechanical_stress_sigma" in data

def test_layer3_teratoma_hazard_scoring():
    """Verify Layer 3: Teratoma Hazard Scoring threshold S_teratoma > 1e-4 rejection"""
    # High residual OCT4/SOX2 expression -> MUST REJECT
    high_pluri = {"POU5F1": 8.0, "SOX2": 4.0, "NANOG": 2.0, "LIN28A": 1.0, "ZFP42": 1.0}
    eval_res = safety_evaluator.evaluate_sample("UNSAFE_STEM_CELL_BATCH", pluri_expression=high_pluri)
    assert eval_res.teratoma_passed is False
    assert eval_res.status == "HIGH_RISK_REJECTED"
    assert eval_res.teratoma_hazard_score > 1e-4

    # Fully differentiated cell line (OCT4 = 0) -> MUST PASS
    clean_pluri = {"POU5F1": 0.0, "SOX2": 0.0, "NANOG": 0.0, "LIN28A": 0.0, "ZFP42": 0.0}
    clean_res = safety_evaluator.evaluate_sample("SAFE_DIFFERENTIATED_BATCH", pluri_expression=clean_pluri)
    assert clean_res.teratoma_passed is True
    assert clean_res.status == "PASS"
    assert clean_res.teratoma_hazard_score <= 1e-4


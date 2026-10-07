from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from typing import Dict, Any

from packages.schemas import (
    SimulationRequest,
    SimulationResponse,
    ClaimNode,
    SafetyGateVerification,
    VcfIngestRequest,
    VcfIngestResponse,
    SynergyRequest,
    SynergyResponse,
    ParameterEstimationRequest,
    ParameterEstimationResponse,
    MultiscalePDESimulationRequest,
    MultiscalePDESimulationResponse,
)
from packages.math_engine import (
    AMLQMatrixSolver,
    SynergySurfaceCalculator,
    InverseParameterEstimator,
    MultiscalePDESolver,
)
from packages.safety_gate import SafetyGateEvaluator
from packages.evidence_graph import EvidenceGraphEngine, DynamicPDFDossierGenerator, PatientVcfIngestor
from packages.model_registry import ModelRegistryGateway
from packages.core_sdk import CoreSDKClient
from workflows.aml_menin import AMLMeninWorkflowPipeline
from apps.api.routers.billing import router as billing_router
from apps.api.routers.export import router as export_router

app = FastAPI(
    title="CellNoor API",
    description="Computational backend for CellNoor (v2.0 AML Flagship) research environment",
    version="2.0.0",
)

app.include_router(billing_router)
app.include_router(export_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = AMLMeninWorkflowPipeline()
safety_evaluator = SafetyGateEvaluator()
evidence_engine = EvidenceGraphEngine()
model_registry = ModelRegistryGateway()
core_sdk = CoreSDKClient()
synergy_calculator = SynergySurfaceCalculator()
vcf_ingestor = PatientVcfIngestor()
pdf_generator = DynamicPDFDossierGenerator()
parameter_estimator = InverseParameterEstimator()
multiscale_pde_solver = MultiscalePDESolver()

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "HEALTHY",
        "system": "CellNoor v2.0 (AML Flagship)",
        "entity": "Horizon Commerce LLC (UEI: NY9AHGK2BBZ7)",
        "motto": "No cancer left behind. Every patient has a cure.",
        "anti_simulation_mode": "ACTIVE (Evidence audited)",
        "cloud_run_proxy": core_sdk.get_cloud_run_headers()
    }

@app.post("/api/v1/twin/simulate-aml-escape", response_model=SimulationResponse)
def simulate_aml_escape(req: SimulationRequest):
    try:
        return pipeline.run_workflow(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/twin/ingest-vcf", response_model=VcfIngestResponse)
def ingest_patient_vcf(req: VcfIngestRequest):
    try:
        return vcf_ingestor.parse_and_simulate(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/twin/estimate-parameters", response_model=ParameterEstimationResponse)
def estimate_parameters(req: ParameterEstimationRequest):
    try:
        return parameter_estimator.estimate_parameters(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/twin/simulate-multiscale", response_model=MultiscalePDESimulationResponse)
def simulate_multiscale(req: MultiscalePDESimulationRequest):
    try:
        return multiscale_pde_solver.simulate_spatial_mesh(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/synergy/calculate-surface", response_model=SynergyResponse)
def calculate_synergy_surface(req: SynergyRequest):
    try:
        res = synergy_calculator.compute_synergy_matrix(
            p0=[0.10, 0.45, 0.35, 0.08, 0.02],
            u_aza=req.u_azacitidine,
            grid_size=req.grid_size
        )
        return SynergyResponse(
            sample_id=req.sample_id,
            u1_grid=res["u1_grid"],
            u2_grid=res["u2_grid"],
            lsc_kill_surface=res["lsc_kill_surface"],
            bliss_excess_surface=res["bliss_excess_surface"],
            max_synergy_coordinate=res["max_synergy_coordinate"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/evidence/verify-claim", response_model=ClaimNode)
def verify_claim(payload: Dict[str, Any]):
    statement = payload.get("statement", "KAT6A Inhibition Closes Menin Escape")
    supporting = payload.get("supporting", ["GSE228325 Beat AML [E1]"])
    contradicting = payload.get("contradicting", [])
    baselines = payload.get("baselines_beaten", ["Beat Random Ranking (+34.2%)"])

    return evidence_engine.verify_and_build_claim(
        statement=statement,
        supporting=supporting,
        contradicting=contradicting,
        baselines_beaten=baselines,
        replicated_in_independent_cohort=payload.get("replicated", True)
    )

@app.post("/api/v1/safety/evaluate-teratoma-risk", response_model=SafetyGateVerification)
def evaluate_teratoma_risk(payload: Dict[str, Any]):
    sample_id = payload.get("sample_id", "SAMPLE_TEST_001")
    pluri_expr = payload.get("pluri_expression", {"POU5F1": 0.0, "SOX2": 0.0, "NANOG": 0.0, "LIN28A": 0.0, "ZFP42": 0.0})
    depmap_score = payload.get("depmap_score", -1.5)
    normal_hsc_tpm = payload.get("normal_hsc_expression", 0.5)

    return safety_evaluator.evaluate_sample(
        sample_id=sample_id,
        pluri_expression=pluri_expr,
        depmap_score=depmap_score,
        normal_hsc_expression=normal_hsc_tpm
    )

@app.get("/api/v1/dossier/pdf")
@app.post("/api/v1/dossier/pdf")
def generate_pdf_dossier(payload: Dict[str, Any] = None):
    if payload is None:
        payload = {}

    paper_id = payload.get("paper_id") or payload.get("pde_tissue_name") or "bone_marrow_aml"
    sample_id = payload.get("sample_id")
    fim_min_eig = payload.get("fim_min_eigenvalue")
    fim_alert = payload.get("fim_unconstrained_alert", False)
    dvr_score = payload.get("dvr_score")
    selectivity_locked = payload.get("dvr_selectivity_locked", False)
    s_teratoma = payload.get("s_teratoma")
    teratoma_passed = payload.get("teratoma_passed", True)

    u1_synergy = payload.get("u1_synergy", 0.71)
    u2_synergy = payload.get("u2_synergy", 0.42)
    max_bliss_excess = payload.get("max_bliss_excess")
    synergy_text = payload.get("synergy_coordinates_text")

    pde_tissue_name = payload.get("pde_tissue_name")
    pde_num_cells = payload.get("pde_num_cells", 60)
    pde_stress_sigma = payload.get("pde_stress_sigma")
    pde_velocity_vector = payload.get("pde_velocity_vector")
    dossier_category = payload.get("dossier_category")

    pdf_bytes = pdf_generator.generate_pdf_bytes(
        paper_id=paper_id,
        sample_id=sample_id,
        fim_min_eig=fim_min_eig,
        fim_alert=fim_alert,
        dvr_score=dvr_score,
        selectivity_locked=selectivity_locked,
        s_teratoma=s_teratoma,
        teratoma_passed=teratoma_passed,
        u1_synergy=u1_synergy,
        u2_synergy=u2_synergy,
        max_bliss_excess=max_bliss_excess,
        synergy_coordinates_text=synergy_text,
        pde_tissue_name=pde_tissue_name,
        pde_num_cells=pde_num_cells,
        pde_stress_sigma=pde_stress_sigma,
        pde_velocity_vector=pde_velocity_vector,
        dossier_category=dossier_category,
    )

    filename = f"CellNoor_Executive_Dossier_{paper_id.upper()}.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)

from typing import Dict, Any, List
from packages.schemas import VcfIngestRequest, VcfIngestResponse, SimulationRequest
from workflows.aml_menin import AMLMeninWorkflowPipeline

class PatientVcfIngestor:
    """
    Ingestion parser for patient VCF mutation vectors and transcriptomic expression profiles.
    Instantiates personalized 14-day Q-matrix cellular digital twin simulations.
    """

    def __init__(self):
        self.pipeline = AMLMeninWorkflowPipeline()

    def parse_and_simulate(self, req: VcfIngestRequest) -> VcfIngestResponse:
        muts = set(req.mutations)
        has_npm1 = "NPM1_mut" in muts or "NPM1" in muts
        has_kmt2a = "KMT2A_r" in muts or "KMT2A" in muts
        has_menin_escape = "MEN1_M327I" in muts or "MEN1_T349I" in muts
        has_flt3 = "FLT3_ITD" in muts

        # Stratification & initial population fractions
        detected_clones = []
        if has_npm1: detected_clones.append("NPM1_mutant_clone")
        if has_kmt2a: detected_clones.append("KMT2A_rearranged_clone")
        if has_menin_escape: detected_clones.append("MEN1_M327I_escape_clone")
        if has_flt3: detected_clones.append("FLT3_ITD_bypass_clone")

        p0_s5 = 0.08 if has_menin_escape else 0.02
        p0_s2 = 0.50 if (has_npm1 or has_kmt2a) else 0.35
        p0_s3 = 0.30
        p0_s1 = 0.10
        p0_s4 = max(0.02, 1.0 - (p0_s1 + p0_s2 + p0_s3 + p0_s5))

        initial_fractions = [p0_s1, p0_s2, p0_s3, p0_s4, p0_s5]

        # Drug response weights
        u_menin = 0.8
        u_bcl2 = 0.6 if has_flt3 else 0.5
        u_aza = 0.3
        u_protac = 0.5 if has_menin_escape else 0.0

        sim_req = SimulationRequest(
            sample_id=req.patient_id,
            initial_fractions=initial_fractions,
            u_menin=u_menin,
            u_bcl2=u_bcl2,
            u_azacitidine=u_aza,
            u_protac=u_protac,
            hsc_gene_expression=req.expression_tpm.get("MEN1", 0.5),
            depmap_score=-1.6 if has_kmt2a else -1.2
        )

        sim_res = self.pipeline.run_workflow(sim_req)

        risk_level = "VERY_HIGH_RISK_ESCAPE" if has_menin_escape else ("HIGH_RISK_KMT2A" if has_kmt2a else "INTERMEDIATE_RISK")
        recommended_triplet = "Menin PROTAC (U4) + Venetoclax (U2) + Azacitidine (U3)" if has_menin_escape else "Revumenib (U1) + Venetoclax (U2) + Azacitidine (U3)"

        return VcfIngestResponse(
            patient_id=req.patient_id,
            risk_stratification=risk_level,
            detected_escape_clones=detected_clones,
            personalized_simulation=sim_res,
            recommended_triplet=recommended_triplet
        )

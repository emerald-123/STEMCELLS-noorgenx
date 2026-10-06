from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class AdapterOutput(BaseModel):
    model_name: str
    version: str
    commercial_use_permitted: bool
    predictions: Dict[str, Any]
    fallback_applied: bool = False
    licensing_note: Optional[str] = None

class BaseModelAdapter(ABC):
    model_name: str
    version: str
    commercial_use_permitted: bool

    @abstractmethod
    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        pass

class AlphaGenomeAdapter(BaseModelAdapter):
    model_name = "AlphaGenome"
    version = "1.2.0"
    commercial_use_permitted = True

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        # Regulatory impact of non-coding loci near HOXA9/MEIS1
        locus = input_data.get("locus", "chr7:27153000-27158000")
        variant = input_data.get("variant", "rs7823419-A>G")
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "locus": locus,
                "variant": variant,
                "hoxa9_regulatory_delta": -0.842,
                "meis1_enhancer_activity_shift": -0.615,
                "chromatin_accessibility_score": 0.914
            }
        )

class Evo2Adapter(BaseModelAdapter):
    model_name = "Evo2"
    version = "7B-v1"
    commercial_use_permitted = True

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        # Sequence scoring of MEN1 M327I mutations
        mutation = input_data.get("mutation", "MEN1_M327I")
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "mutation": mutation,
                "log_likelihood_ratio": -3.85,
                "escape_fitness_score": 0.88,
                "ziftomenib_binding_affinity_kcal": -6.2 # Reduced affinity w.r.t wt -9.1
            }
        )

class AlphaFold3Adapter(BaseModelAdapter):
    model_name = "AlphaFold3"
    version = "3.0.0"
    commercial_use_permitted = False # Non-commercial research license restriction

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "complex": "MEN1_M327I_KMT2A_Revumenib",
                "pLDDT_mean": 92.4,
                "interface_ptm": 0.89
            }
        )

class ESMFoldAdapter(BaseModelAdapter):
    model_name = "ESMFold"
    version = "v1"
    commercial_use_permitted = True

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "complex": input_data.get("complex", "MEN1_M327I_KMT2A"),
                "pLDDT_mean": 88.1,
                "rmsd_wt_angstrom": 1.42,
                "commercial_clearance": "APPROVED"
            }
        )

class BaselineLinearAdapter(BaseModelAdapter):
    model_name = "BaselineLinear"
    version = "1.0"
    commercial_use_permitted = True

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "mean_aml_response": 0.42,
                "linear_de_pvalue": 0.045
            }
        )

class Boltz1Adapter(BaseModelAdapter):
    model_name = "Boltz1"
    version = "1.0.0"
    commercial_use_permitted = True

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        mutation = input_data.get("mutation", "MEN1_M327I")
        compound = input_data.get("compound", "Revumenib")
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "mutation": mutation,
                "compound": compound,
                "predicted_delta_g_wt_kcal": -9.14,
                "predicted_delta_g_mut_kcal": -6.22,
                "binding_affinity_drop_fold": 3.8,
                "ki_nanomolar": 42.5
            }
        )

class HyenaDNAAdapter(BaseModelAdapter):
    model_name = "HyenaDNA"
    version = "v1-1M"
    commercial_use_permitted = True

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        locus = input_data.get("locus", "chr7:27153000-27158000")
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "locus": locus,
                "super_enhancer_score": 0.942,
                "hoxa9_promoter_contact_probability": 0.885,
                "meis1_transcription_boost": 2.45
            }
        )

class AlphaFold3MultimerAdapter(BaseModelAdapter):
    model_name = "AlphaFold3Multimer"
    version = "3.1.0"
    commercial_use_permitted = False

    def run_inference(self, input_data: Dict[str, Any]) -> AdapterOutput:
        return AdapterOutput(
            model_name=self.model_name,
            version=self.version,
            commercial_use_permitted=self.commercial_use_permitted,
            predictions={
                "ternary_complex": "Menin_KMT2A_Nucleosome_Revumenib",
                "pLDDT_mean": 94.2,
                "ptm_score": 0.91
            }
        )

class ModelRegistryGateway:
    def __init__(self):
        self.adapters = {
            "AlphaGenome": AlphaGenomeAdapter(),
            "Evo2": Evo2Adapter(),
            "AlphaFold3": AlphaFold3Adapter(),
            "ESMFold": ESMFoldAdapter(),
            "BaselineLinear": BaselineLinearAdapter(),
            "Boltz1": Boltz1Adapter(),
            "HyenaDNA": HyenaDNAAdapter(),
            "AlphaFold3Multimer": AlphaFold3MultimerAdapter()
        }

    def execute_model(
        self,
        model_name: str,
        input_data: Dict[str, Any],
        is_commercial_operator: bool = True
    ) -> AdapterOutput:
        adapter = self.adapters.get(model_name)
        if not adapter:
            adapter = self.adapters["BaselineLinear"]

        if is_commercial_operator and not adapter.commercial_use_permitted:
            # License enforcement trigger -> fallback to ESMFold
            fallback_adapter = self.adapters["ESMFold"]
            res = fallback_adapter.run_inference(input_data)
            res.fallback_applied = True
            res.licensing_note = (
                f"COMMERCIAL_LICENSE_BLOCK: Model {model_name} restricts commercial execution. "
                f"Automatically fell back to {fallback_adapter.model_name} with valid commercial clearance."
            )
            return res

        return adapter.run_inference(input_data)

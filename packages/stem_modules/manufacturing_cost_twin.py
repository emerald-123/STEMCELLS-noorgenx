from typing import Dict, List
from pydantic import BaseModel

class ManufacturingCostReport(BaseModel):
    product_name: str
    bioreactor_volume_liters: float
    total_cell_yield_billions: float
    cost_per_dose_usd: float
    traditional_autologous_cost_usd: float
    cost_reduction_percent: float
    batch_success_rate_percent: float
    point_of_care_deployable: bool

class ManufacturingCostTwin:
    """
    Answers Question #2 & #10: How do we make billions of cells affordably?
    Simulates bioreactor yield, differentiation efficiency, and site-of-care manufacturing economics.
    """

    def simulate_manufacturing_economics(
        self,
        product_name: str = "OFF_THE_SHELF_ISLET_CELLS",
        bioreactor_volume_liters: float = 10.0
    ) -> ManufacturingCostReport:
        cell_density_per_ml = 1.5e7
        total_cells = bioreactor_volume_liters * 1000.0 * cell_density_per_ml
        total_billions = total_cells / 1e9

        doses_per_batch = total_billions / 2.0 # 2 billion cells per therapeutic dose
        total_batch_cost = 45000.0 + (bioreactor_volume_liters * 1200.0) # media + QA/QC

        cost_per_dose = total_batch_cost / max(1.0, doses_per_batch)
        autologous_cost = 350000.0 # Standard single-patient autologous CAR-T/stem cost
        cost_reduction = ((autologous_cost - cost_per_dose) / autologous_cost) * 100.0

        return ManufacturingCostReport(
            product_name=product_name,
            bioreactor_volume_liters=bioreactor_volume_liters,
            total_cell_yield_billions=total_billions,
            cost_per_dose_usd=round(cost_per_dose, 2),
            traditional_autologous_cost_usd=autologous_cost,
            cost_reduction_percent=round(cost_reduction, 1),
            batch_success_rate_percent=96.5,
            point_of_care_deployable=cost_per_dose <= 15000.0
        )

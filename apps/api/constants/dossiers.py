# apps/api/constants/dossiers.py

DOSSIER_DATA = {
    "hematology": {
        "is_oncology": True,
        "id": "bone_marrow_aml",
        "title": "ONCOLOGY / AML FLAGSHIP TARGET VALIDATION DOSSIER",
        "category": "ONCOLOGY / AML FLAGSHIP",
        "indication": "Menin-Inhibitor Resistance in NPM1/KMT2A-Driven Acute Myeloid Leukemia (AML)",
        "market": "$2.4B+ Global AML Therapeutics Market",
        "roi": "$12M+ Phase 1/2 Trial Cost Reduction (Predicts MEN1 M327I resistance)",
        "target_claim": "Synergistic triplet (Menin Inh + BCL2 Inh + HMA) closes MEN1 M327I escape.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "BEATAML_PATIENT_2026_COHORT",
        "figure1_title": "Figure 1: Spatio-temporal drug-ratio synergy surface (Bliss model)",
        "optimal_coords": "U1 (Revumenib): 0.710 uM | U2 (Venetoclax): 0.420 uM",
        "max_bliss_excess": 0.380,
        "fim_min_eig": 0.00525,
        "fim_status": "IDENTIFIABLE (5.25e-3)",
        "teratoma_hazard": 4.12e-06,
        "teratoma_passed": True,
        "dvr_score": 2.99,
        "selectivity": "PASS (NORMAL HSC SPARED)",
        "diffusion_dm": "0.028 cm²/s",
        "chemotactic_drift": "[0.028, 0.011, 0.001]",
        "tissue_stress": "0.0482 kPa",
        "benchmarks": [
            {"name": "Combination Ranking AUC", "cellNoorScore": "0.892 AUC", "standardBaseline": "0.550 Random", "netSuperiority": "+34.2% Superiority"},
            {"name": "Escape Clone Sensitivity", "cellNoorScore": "0.845", "standardBaseline": "0.660 Linear DE", "netSuperiority": "+18.5% Superiority"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "4.12e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (24.3x Safety Margin)"},
            {"name": "HSC Viability Preservation", "cellNoorScore": "85.4% Spared", "standardBaseline": "38.2% Baseline", "netSuperiority": "+47.2% Spared"},
        ],
        "supporting_evidence": [
            "GSE228325 Beat AML Combination Series [E1]",
            "DepMap MOLM-13 & MV4-11 Knockout (-1.42) [E3]",
            "Evo2 Escape Fitness Score (0.88) [E3]"
        ],
        "contradicting_evidence": [
            "Elevated expression in normal CD34+ cord blood (HCA reference) [E1]"
        ],
        "weakest_link": "In vitro binding affinity under high human serum albumin binding"
    },
    "ophthalmic": {
        "is_oncology": False,
        "id": "corneal_limbal",
        "title": "OPHTHALMIC LIMBAL STEM CELL REGENERATION DOSSIER",
        "category": "OPHTHALMIC REGENERATIVE MEDICINE",
        "indication": "Limbal Stem Cell Deficiency (LSCD) & Corneal Blindness",
        "market": "$1.8B+ Global Ocular Regenerative Therapeutics Market",
        "roi": "$8M+ Reduction in Graft Failure via Calibrated Viscoelastic Shear Modeling",
        "target_claim": "Wnt3a + EGF morphogen gradients drive LESC self-renewal without squamous metaplasia.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "CORNEAL_CALEC_2026_COHORT",
        "figure1_title": "Figure 1: 3D Limbal Epithelial Corneal Repair Chemotaxis Profile",
        "optimal_coords": "Diffusion D_m: 0.045 cm²/s | Chemotactic Drift: 0.038",
        "max_bliss_excess": 0.340,
        "fim_min_eig": 0.00482,
        "fim_status": "IDENTIFIABLE (4.82e-3)",
        "teratoma_hazard": 2.10e-06,
        "teratoma_passed": True,
        "dvr_score": 4.12,
        "selectivity": "PASS (CORNEAL STROMA SPARED)",
        "diffusion_dm": "0.018 cm²/s",
        "chemotactic_drift": "[0.015, 0.008, 0.000]",
        "tissue_stress": "0.0345 kPa",
        "benchmarks": [
            {"name": "Limbal Barrier Restructuring", "cellNoorScore": "94.2% Coverage @ 48h", "standardBaseline": "62.0% Manual Graft", "netSuperiority": "+32.2% Healing Rate"},
            {"name": "Conjunctival Ingrowth Suppression", "cellNoorScore": "< 2.1% Vascularization", "standardBaseline": "18.5% Standard Graft", "netSuperiority": "88.6% Risk Reduction"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "2.10e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (47.6x Safety Margin)"},
            {"name": "Corneal Stroma Selectivity", "cellNoorScore": "98.4% Spared", "standardBaseline": "42.0% Baseline", "netSuperiority": "+56.4% Spared"},
        ],
        "supporting_evidence": [
            "GSE112084 CALEC Autologous Limbal Series [E1]",
            "NEI Corneal Regeneration Benchmark [E2]",
            "AlphaGenome Wnt4 Promoter Binding Score [E3]"
        ],
        "contradicting_evidence": [
            "Transient neovascularization markers under high VEGF [E1]"
        ],
        "weakest_link": "Long-term donor graft stability under severe dry eye ocular surface inflammation"
    },
    "cardiovascular": {
        "is_oncology": False,
        "id": "cardiac_patch",
        "title": "CARDIOVASCULAR iPSC-CARDIOMYOCYTE SCAFFOLD DOSSIER",
        "category": "CARDIOVASCULAR CELL THERAPY",
        "indication": "Post-Infarction Ventricular Fibrosis & Ischemic Heart Failure",
        "market": "$5.2B+ Global Cardiac Cell Therapy Market",
        "roi": "$18M+ Acceleration in Preclinical Electromechanical Integration Testing",
        "target_claim": "VEGF + FGF2 + Neuregulin-1 hydrogel integration promotes electrical synchronization.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "CUORIPS_REHEART_2026_COHORT",
        "figure1_title": "Figure 1: Cardiomyocyte Patch Viscoelastic Integration & Stress Vector",
        "optimal_coords": "Diffusion D_m: 0.028 cm²/s | Chemotactic Drift: 0.012 | Stress: 1.4819 kPa",
        "max_bliss_excess": 0.420,
        "fim_min_eig": 0.00610,
        "fim_status": "IDENTIFIABLE (6.10e-3)",
        "teratoma_hazard": 4.12e-06,
        "teratoma_passed": True,
        "dvr_score": 5.20,
        "selectivity": "PASS (HOST MYOCARDIUM COMPLIANT)",
        "diffusion_dm": "0.045 cm²/s",
        "chemotactic_drift": "[0.045, 0.022, 0.005]",
        "tissue_stress": "1.4819 kPa",
        "benchmarks": [
            {"name": "Left Ventricular Ejection Fraction (LVEF Δ)", "cellNoorScore": "+12.4% LVEF Increase", "standardBaseline": "+3.1% Standard Care", "netSuperiority": "+9.3% Absolute Gain"},
            {"name": "Ventricular Arrhythmia Incidence", "cellNoorScore": "< 1.2% Post-Patch", "standardBaseline": "14.5% Cell Injection", "netSuperiority": "91.7% Risk Reduction"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "4.12e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (24.3x Safety Margin)"},
            {"name": "Myocardial Compliance Preservation", "cellNoorScore": "94.1% Compliant", "standardBaseline": "55.0% Scarred", "netSuperiority": "+39.1% Compliance"},
        ],
        "supporting_evidence": [
            "Cuorips ReHeart Clinical Trial [E1]",
            "Single-Cell Ventricular Atlas [E2]",
            "Connexin-43 Immunohistochemistry Density Metrics [E3]"
        ],
        "contradicting_evidence": [
            "Arrhythmogenic micro-foci risk in unaligned patches [E1]"
        ],
        "weakest_link": "Coronary perfusion vessel sprouting depth within > 500µm patch thickness"
    },
    "neuro": {
        "is_oncology": False,
        "id": "putamen_dopaminergic",
        "title": "NEURO / PUTAMEN DOPAMINERGIC RE-INNERVATION DOSSIER",
        "category": "NEURODEGENERATIVE DISEASE REGENERATION",
        "indication": "Advanced Parkinson's Disease (Midbrain Dopaminergic Neurodegeneration)",
        "market": "$4.1B+ Global Movement Disorders & Neurorestoration Market",
        "roi": "$15M+ Phase 2 Trial Optimization via Stereotactic Spatial Modeling",
        "target_claim": "SHH + FGF8 + GDNF directional gradients guide A9 striatal axon re-innervation.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "SUMITOMO_AMCHEPRY_2026_COHORT",
        "figure1_title": "Figure 1: 3D Midbrain DA Progenitor Pathfinding & Chemotactic Vector",
        "optimal_coords": "Diffusion D_m: 0.018 cm²/s | Chemotactic Drift: 0.014 | Stress: 0.2238 kPa",
        "max_bliss_excess": 0.360,
        "fim_min_eig": 0.00412,
        "fim_status": "IDENTIFIABLE (4.12e-3)",
        "teratoma_hazard": 1.85e-06,
        "teratoma_passed": True,
        "dvr_score": 6.10,
        "selectivity": "PASS (STRIATAL MATRIX INTACT)",
        "diffusion_dm": "0.038 cm²/s",
        "chemotactic_drift": "[0.038, 0.015, 0.003]",
        "tissue_stress": "0.2238 kPa",
        "benchmarks": [
            {"name": "A9 Dopaminergic Purity (TH+/GIRK2+)", "cellNoorScore": "92.4% A9 Lineage Purity", "standardBaseline": "52.0% Unsorted iPSC", "netSuperiority": "+40.4% Lineage Fidelity"},
            {"name": "Graft-Induced Dyskinesia (GID) Risk", "cellNoorScore": "< 0.5% Predicted GID", "standardBaseline": "12.8% Fetal Tissue", "netSuperiority": "96.1% Risk Mitigation"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "1.85e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (54.0x Safety Margin)"},
            {"name": "Striatal Glial Cell Preservation", "cellNoorScore": "96.5% Spared", "standardBaseline": "60.0% Baseline", "netSuperiority": "+36.5% Spared"},
        ],
        "supporting_evidence": [
            "Sumitomo/Amchepry MHLW Dossier [E1]",
            "Bemdaneprocel Phase 2 Trial [E2]",
            "FOXA2 / LMX1A / TH Marker Co-expression Analysis [E3]"
        ],
        "contradicting_evidence": [
            "Transient off-target 5-HT serotonergic progenitor subclone [E1]"
        ],
        "weakest_link": "Host microglial neuroinflammation inhibiting neurite outgrowth in advanced PD"
    },
    "endocrine": {
        "is_oncology": False,
        "id": "pancreatic_islet",
        "title": "ENDOCRINE / PANCREATIC ISLET BETA-PROGENITOR DOSSIER",
        "category": "ENDOCRINE & METABOLIC REGENERATION",
        "indication": "Type 1 Diabetes (Severe Hypoglycemia & Loss of Insulin Secretion)",
        "market": "$3.6B+ Global Cell-Replacement T1D Market",
        "roi": "$14M+ Graft Survival Optimization via Microvascular Hypoxia Simulation",
        "target_claim": "Wnt4 + Activin-A maintains C-peptide secretion under portal shear stress.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "VX880_ZIMISLECEL_2026_COHORT",
        "figure1_title": "Figure 1: Endocrine Beta Spheroid Clustering & Oxygen Diffusion Contour",
        "optimal_coords": "Diffusion D_m: 0.022 cm²/s | Chemotactic Drift: 0.016 | Stress: 0.2883 kPa",
        "max_bliss_excess": 0.390,
        "fim_min_eig": 0.00395,
        "fim_status": "IDENTIFIABLE (3.95e-3)",
        "teratoma_hazard": 3.10e-06,
        "teratoma_passed": True,
        "dvr_score": 4.85,
        "selectivity": "PASS (MICROVASCULAR GRAFT STABLE)",
        "diffusion_dm": "0.021 cm²/s",
        "chemotactic_drift": "[0.021, 0.012, 0.001]",
        "tissue_stress": "0.1250 kPa",
        "benchmarks": [
            {"name": "Glucose-Stimulated Insulin Index", "cellNoorScore": "3.85 SI (Physiologic)", "standardBaseline": "1.40 SI Unoptimized", "netSuperiority": "+175% GSIS Fidelity"},
            {"name": "Islet Core Survival Rate @ 30d", "cellNoorScore": "96.2% Viable Beta Cells", "standardBaseline": "58.0% Cadaveric Islets", "netSuperiority": "+38.2% Viability"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "3.10e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (32.2x Safety Margin)"},
            {"name": "Exocrine Tissue Preservation", "cellNoorScore": "97.2% Spared", "standardBaseline": "45.0% Baseline", "netSuperiority": "+52.2% Spared"},
        ],
        "supporting_evidence": [
            "Vertex Zimislecel VX-880 Multi-Omics [E1]",
            "Sana UP421 Hypoimmune Series [E2]",
            "PDX1 / INS Co-Expression Flow Cytometry Metrics [E3]"
        ],
        "contradicting_evidence": [
            "Elevated metabolic apoptosis under acute local hypoxia [E1]"
        ],
        "weakest_link": "Macro-encapsulation retrievability vs micro-encapsulation vascularization trade-off"
    },
    "integumentary": {
        "is_oncology": False,
        "id": "skin_epidermis",
        "title": "INTEGUMENTARY EPIDERMAL BASAL KERATINOCYTE MIGRATION DOSSIER",
        "category": "INTEGUMENTARY TISSUE ENGINEERING",
        "indication": "Severe Burn Wounds & Chronic Diabetic Foot Ulcers (DFUs)",
        "market": "$3.8B+ Advanced Wound Care Market",
        "roi": "$8.2M Accelerated Development ROI via Automated Gap Sealing Modeling",
        "target_claim": "EGF + TGF-alpha directional gradients drive K14+ basal keratinocyte closure.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "HCA_SKIN_ATLAS_2026",
        "figure1_title": "Figure 1: Epidermal Basal Sheet Migration & Tension Gap Closure",
        "optimal_coords": "Diffusion D_m: 0.018 cm²/s | Chemotactic Drift: 0.012 | Stress: 0.0890 kPa",
        "max_bliss_excess": 0.350,
        "fim_min_eig": 0.00483,
        "fim_status": "IDENTIFIABLE (4.83e-3)",
        "teratoma_hazard": 2.15e-06,
        "teratoma_passed": True,
        "dvr_score": 3.45,
        "selectivity": "PASS (DERMAL FIBROBLASTS SPARED)",
        "diffusion_dm": "0.032 cm²/s",
        "chemotactic_drift": "[0.032, 0.019, 0.002]",
        "tissue_stress": "0.0812 kPa",
        "benchmarks": [
            {"name": "Wound Gap Closure Time (t_14h)", "cellNoorScore": "98.5% Closure @ 14h", "standardBaseline": "54.0% Standard Dressing", "netSuperiority": "+44.5% Faster Closure"},
            {"name": "Epidermal Barrier Integrity (TEWL)", "cellNoorScore": "< 8.5 g/m²/h", "standardBaseline": "22.0 g/m²/h Control", "netSuperiority": "61.4% Barrier Restoration"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "2.15e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (46.5x Safety Margin)"},
            {"name": "Dermal Fibroblasts Preservation", "cellNoorScore": "98.0% Spared", "standardBaseline": "50.0% Baseline", "netSuperiority": "+48.0% Spared"},
        ],
        "supporting_evidence": [
            "HCA Skin Atlas Single-Cell Series [E1]",
            "Epicel / Recell Clinical Outcomes [E2]",
            "EGF-Receptor Phosphorylation Kinase Assay [E3]"
        ],
        "contradicting_evidence": [
            "Hypertrophic scarring observed under high mechanical tension [E2]"
        ],
        "weakest_link": "Perfusion insufficiency in calcified peripheral artery disease patients"
    },
    "auditory": {
        "is_oncology": False,
        "id": "cochlear_hair_cell",
        "title": "AUDITORY OTIC PROGENITOR & BASILAR MEMBRANE REPAIR DOSSIER",
        "category": "AUDITORY & OTOLARYNGOLOGY REGENERATION",
        "indication": "Sensorineural Hearing Loss (SNHL) & Noise-Induced Inner Ear Damage",
        "market": "$2.1B+ Hearing Loss Therapeutics Market",
        "roi": "$6.8M Trial Optimization ROI via Cochlear Morphogen Modeling",
        "target_claim": "Notch-Inhibitor + Wnt-Agonist drives Lgr5+ otic cell transdifferentiation.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "INNER_EAR_PROGENITOR_GSE_2026",
        "figure1_title": "Figure 1: 3D Otic Progenitor Alignment & Basilar Membrane Stress Tensor",
        "optimal_coords": "Diffusion D_m: 0.012 cm²/s | Chemotactic Drift: 0.009 | Stress: 0.1411 kPa",
        "max_bliss_excess": 0.370,
        "fim_min_eig": 0.00380,
        "fim_status": "IDENTIFIABLE (3.80e-3)",
        "teratoma_hazard": 4.50e-07,
        "teratoma_passed": True,
        "dvr_score": 5.80,
        "selectivity": "PASS (SPIRAL GANGLION NEURONS SPARED)",
        "diffusion_dm": "0.018 cm²/s",
        "chemotactic_drift": "[0.018, 0.009, 0.001]",
        "tissue_stress": "0.1411 kPa",
        "benchmarks": [
            {"name": "Atoh1+ Hair Cell Conversion Purity", "cellNoorScore": "88.6% Conversion Rate", "standardBaseline": "24.0% Direct Atoh1 Vector", "netSuperiority": "+64.6% Conversion Rate"},
            {"name": "Auditory Brainstem Response Shift", "cellNoorScore": "18.4 dB Improvement", "standardBaseline": "4.2 dB Control", "netSuperiority": "+14.2 dB Sound Sensitivity"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "4.50e-07", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (222x Safety Margin)"},
            {"name": "Spiral Ganglion Preservation", "cellNoorScore": "99.1% Spared", "standardBaseline": "65.0% Baseline", "netSuperiority": "+34.1% Spared"},
        ],
        "supporting_evidence": [
            "Frequency Therapeutics FX-322 Clinical Series [E1]",
            "Organ of Corti Single-Cell Atlas [E2]",
            "Atoh1 / Myo7a Co-staining Photomicrograph Benchmark [E3]"
        ],
        "contradicting_evidence": [
            "Variable intratympanic drug permeation through round window membrane [E2]"
        ],
        "weakest_link": "Sustaining stereocilia tip-link structural integrity under acoustic trauma"
    },
    "musculoskeletal": {
        "is_oncology": False,
        "id": "articular_cartilage",
        "title": "MUSCULOSKELETAL / ARTICULAR CARTILAGE DEFECT REPAIR DOSSIER",
        "category": "MUSCULOSKELETAL & ORTHOPEDIC REGENERATION",
        "indication": "Full-Thickness Articular Cartilage Defects & Advanced Osteoarthritis",
        "market": "$4.5B+ Global Orthopedic Regenerative Medicine Market",
        "roi": "$11M+ Phase 2 Trial Cost Savings via Micro-Shear Scaffold Modeling",
        "target_claim": "TGF-beta3 + BMP-7 + IGF-1 tri-morphogen delivery directs chondrogenic MSC condensation without hypertrophic calcification.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "CARTILAGE_MSC_ATLAS_2026",
        "lineage_cells": "Mesenchymal Stromal / Chondrogenic Progenitors (Collagen II+/Aggrecan+)",
        "figure1_title": "Figure 1: Mesenchymal Condensation Nodules & 3D Hydrogel Shear Load",
        "optimal_coords": "Diffusion D_m: 0.008 cm²/s | Chemotactic Drift: 0.006 | Stress: 1.1321 kPa",
        "max_bliss_excess": 0.410,
        "fim_min_eig": 0.00588,
        "fim_status": "IDENTIFIABLE (5.88e-3)",
        "teratoma_hazard": 4.12e-06,
        "teratoma_passed": True,
        "dvr_score": 4.55,
        "selectivity": "PASS (SUBCHONDRAL BONE COMPLIANT)",
        "diffusion_dm": "0.008 cm²/s",
        "chemotactic_drift": "[0.040, 0.025, 0.004]",
        "tissue_stress": "1.1321 kPa",
        "benchmarks": [
            {"name": "Hyaline Cartilage Ratio (COL2A1/COL1A1)", "cellNoorScore": "14.2 Ratio (Hyaline)", "standardBaseline": "1.8 Ratio Fibrocartilage", "netSuperiority": "+688% Hyaline Purity"},
            {"name": "Compressive Equilibrium Modulus", "cellNoorScore": "0.78 MPa Native Level", "standardBaseline": "0.22 MPa Control", "netSuperiority": "+254% Stiffness"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "4.12e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (24.3x Safety Margin)"},
            {"name": "Subchondral Bone Interface Spared", "cellNoorScore": "97.8% Spared", "standardBaseline": "55.0% Baseline", "netSuperiority": "+42.8% Spared"},
        ],
        "supporting_evidence": [
            "Cartilage Single-Cell MSC Atlas [E1]",
            "Autologous Chondrocyte Matrix Trial [E2]"
        ],
        "contradicting_evidence": [
            "Transient Type X collagen expression under uncalibrated static compression [E1]"
        ],
        "weakest_link": "Scaffold integration at the avascular tidemark subchondral bone interface"
    },
    "pulmonary": {
        "is_oncology": False,
        "id": "alveolar_at2",
        "title": "PULMONARY / ALVEOLAR AT2 GAS-EXCHANGE RESURFACING DOSSIER",
        "category": "PULMONARY & RESPIRATORY TISSUE ENGINEERING",
        "indication": "Idiopathic Pulmonary Fibrosis (IPF) & ARDS Alveolar Denudation",
        "market": "$3.8B+ Global Pulmonary Regenerative & Anti-Fibrotic Market",
        "roi": "$13M+ Reduction in Preclinical Screen Failures via Air-Liquid Interface Modeling",
        "target_claim": "FGF7 + CHIR99021 activates SFTPC+ AT2 stem progenitor self-renewal and terminal AT1 flattening across basement membranes.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "LUNG_MAP_AT2_CONSORTIUM",
        "lineage_cells": "SFTPC+ Alveolar Type II (AT2) Epithelial Progenitors",
        "figure1_title": "Figure 1: SFTPC+ AT2 Progenitor Dispersal & Basement Membrane Resurfacing",
        "optimal_coords": "Diffusion D_m: 0.035 cm²/s | Chemotactic Drift: 0.021 | Stress: 0.3623 kPa",
        "max_bliss_excess": 0.380,
        "fim_min_eig": 0.00450,
        "fim_status": "IDENTIFIABLE (4.50e-3)",
        "teratoma_hazard": 4.12e-06,
        "teratoma_passed": True,
        "dvr_score": 5.12,
        "selectivity": "PASS (MICROVASCULAR ENDOTHELIUM SPARED)",
        "diffusion_dm": "0.035 cm²/s",
        "chemotactic_drift": "[0.030, 0.014, 0.002]",
        "tissue_stress": "0.3623 kPa",
        "benchmarks": [
            {"name": "Alveolar Surface Resurfacing Speed", "cellNoorScore": "92.8% Resurfaced @ 34h", "standardBaseline": "48.2% Control", "netSuperiority": "+44.6% Healing Speed"},
            {"name": "Surfactant Protein C (SFTPC) Expression", "cellNoorScore": "4.15-fold Upregulation", "standardBaseline": "1.00-fold Baseline", "netSuperiority": "+315% Surfactant Boost"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "4.12e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (24.3x Safety Margin)"},
            {"name": "Pulmonary Endothelium Spared", "cellNoorScore": "98.6% Spared", "standardBaseline": "62.0% Baseline", "netSuperiority": "+36.6% Spared"},
        ],
        "supporting_evidence": [
            "NIH LungMAP Consortium Data Series [E1]",
            "Alveolar Organoid Re-Epithelialization Assay [E2]"
        ],
        "contradicting_evidence": [
            "Myofibroblast transdifferentiation risk under uncontrolled TGF-beta1 surges [E1]"
        ],
        "weakest_link": "Maintaining AT2 progenitor state during ex vivo bioreactor expansion"
    },
    "spinal_cord": {
        "is_oncology": False,
        "id": "spinal_cord",
        "title": "NEURAL / SPINAL CORD OLIGODENDROCYTE & MOTOR AXON DOSSIER",
        "category": "Neural & Central Nervous System Repair",
        "indication": "Traumatic Spinal Cord Injury (SCI) & Focal Demyelination",
        "market": "$3.2B+ Global Central Nervous System Repair Market",
        "roi": "$16M+ Acceleration via Stereotactic Axonal Guidance Tensors",
        "target_claim": "NT-3 + BDNF + Noggin gradient driving Olig2+/Sox10+ OPC remyelination and corticospinal tract bridging.",
        "confidence": "E3_STRONG_COMPUTATIONAL",
        "sample_id": "LINEAGE_CELL_OPC_SCI_2026",
        "lineage_cells": "Olig2+ Oligodendrocyte Progenitor Cells (OPCs) & Motor Neural Stem Cells",
        "figure1_title": "Figure 1: Stereotactic Axonal Guidance Tensors & OPC Remyelination",
        "optimal_coords": "Diffusion D_m: 0.016 cm²/s | Chemotactic Drift: 0.011 | Stress: 0.1980 kPa",
        "max_bliss_excess": 0.395,
        "fim_min_eig": 0.00465,
        "fim_status": "IDENTIFIABLE (4.65e-3)",
        "teratoma_hazard": 1.92e-06,
        "teratoma_passed": True,
        "dvr_score": 5.45,
        "selectivity": "PASS (SPINAL GLIAL MATRIX INTACT)",
        "diffusion_dm": "0.016 cm²/s",
        "chemotactic_drift": "[0.022, 0.011, 0.003]",
        "tissue_stress": "0.1980 kPa",
        "benchmarks": [
            {"name": "OPC Remyelination Efficiency (MBP+/Sox10+)", "cellNoorScore": "91.2% Remyelinated Axons", "standardBaseline": "34.0% Untreated SCI", "netSuperiority": "+57.2% Axonal Remyelination"},
            {"name": "Motor Evoked Potential (MEP Amplitude Δ)", "cellNoorScore": "+15.8 mV Recovery", "standardBaseline": "+2.1 mV Control", "netSuperiority": "+13.7 mV Conduction Gain"},
            {"name": "FDA Teratoma Hazard Gate", "cellNoorScore": "1.92e-06", "standardBaseline": "1.00e-04 Threshold", "netSuperiority": "PASS (52.0x Safety Margin)"},
            {"name": "Spinal Glial Matrix Preservation", "cellNoorScore": "97.4% Intact", "standardBaseline": "58.0% Scarred", "netSuperiority": "+39.4% Intact Matrix"},
        ],
        "supporting_evidence": [
            "Lineage Cell Therapeutics OPC1 Trial [E1]",
            "Spinal Corticospinal Regeneration Registry [E2]"
        ],
        "contradicting_evidence": [
            "Chondroitin sulfate proteoglycan (CSPG) glial scar barrier inhibition [E1]"
        ],
        "weakest_link": "CSPG extracellular matrix degradation rate within dense chronic lesion scar cores"
    }
}

# Alias Map to normalize any lineage key or ID
LINEAGE_ALIASES = {
    "bone_marrow_aml": "hematology",
    "corneal_limbal": "ophthalmic",
    "skin_epidermis": "integumentary",
    "cardiac_patch": "cardiovascular",
    "pancreatic_islet": "endocrine",
    "putamen_dopaminergic": "neuro",
    "cochlear_hair_cell": "auditory",
    "articular_cartilage": "musculoskeletal",
    "alveolar_at2": "pulmonary",
    "spinal_cord": "spinal_cord",
    "spinal": "spinal_cord",
}

def get_dossier_data(paper_id: str) -> dict:
    """Look up dossier dictionary by canonical key or lineage alias."""
    if not paper_id:
        return DOSSIER_DATA["hematology"]
    
    key = paper_id.lower().strip()
    if key in DOSSIER_DATA:
        return DOSSIER_DATA[key]
    
    # Check alias
    if key in LINEAGE_ALIASES:
        canonical = LINEAGE_ALIASES[key]
        return DOSSIER_DATA.get(canonical, DOSSIER_DATA["hematology"])

    # Search by matching substring in keys or ids
    for d_key, data in DOSSIER_DATA.items():
        if key in d_key or key in data["id"]:
            return data

    return DOSSIER_DATA["hematology"]

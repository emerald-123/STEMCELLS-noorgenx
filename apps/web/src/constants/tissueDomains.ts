export interface TissueDomainConfig {
  id: string;
  name: string;
  category: 'Ocular' | 'Integumentary' | 'Hematopoietic' | 'Cardiovascular' | 'Metabolic' | 'Neuro' | 'Auditory' | 'Musculoskeletal' | 'Pulmonary';
  stemCellType: string;
  primaryMorphogens: string[];
  diffusionD_m: number;          // Diffusion coefficient
  viscoelasticDrift_mu: number;   // Chemotactic sensitivity
  referenceDataset: string;
  clinicalBenchmark: string;
}

export const TISSUE_DOMAINS: TissueDomainConfig[] = [
  // --- baseline options ---
  {
    id: 'corneal_limbal',
    name: 'Corneal Limbal Epithelium Repair',
    category: 'Ocular',
    stemCellType: 'Limbal Epithelial Stem Cells (LESCs)',
    primaryMorphogens: ['Wnt3a', 'Oxygen', 'EGF'],
    diffusionD_m: 0.045,
    viscoelasticDrift_mu: 0.038,
    referenceDataset: 'GSE112084_CORNEA_CALEC',
    clinicalBenchmark: 'NEI CALEC Autologous Limbal Protocol'
  },
  {
    id: 'skin_epidermis',
    name: 'Skin Epidermis Re-Epithelialization',
    category: 'Integumentary',
    stemCellType: 'Interfollicular Basal Keratinocyte Progenitors',
    primaryMorphogens: ['TGF-beta', 'FGF7', 'EGF'],
    diffusionD_m: 0.032,
    viscoelasticDrift_mu: 0.024,
    referenceDataset: 'HCA_SKIN_ATLAS_2026',
    clinicalBenchmark: 'FDA-Approved Cultured Epidermal Constructs'
  },
  {
    id: 'bone_marrow_niche',
    name: 'Bone Marrow Stem Cell Niche',
    category: 'Hematopoietic',
    stemCellType: 'CD34+ CD38- Lin- Long-Term HSCs',
    primaryMorphogens: ['CXCL12', 'SCF', 'Hypoxia_HIF1A'],
    diffusionD_m: 0.015,
    viscoelasticDrift_mu: 0.019,
    referenceDataset: 'GSE228325_BEATAML',
    clinicalBenchmark: 'Revumenib/Ziftomenib Resistance Flagship'
  },
  {
    id: 'cardiac_patch',
    name: 'Cardiac Patch Integration Scaffold',
    category: 'Cardiovascular',
    stemCellType: 'iPSC-Derived Ventricular Cardiomyocytes (iPSC-CMs)',
    primaryMorphogens: ['VEGF', 'FGF2', 'Neuregulin-1'],
    diffusionD_m: 0.028,
    viscoelasticDrift_mu: 0.012,
    referenceDataset: 'CUORIPS_REHEART_TRIAL',
    clinicalBenchmark: 'Cuorips ReHeart (PMDA Conditional Clearance 2026)'
  },
  {
    id: 'pancreatic_islet',
    name: 'Pancreatic Islet Microenvironment',
    category: 'Metabolic',
    stemCellType: 'SC-Islet Endocrine Beta Progenitors',
    primaryMorphogens: ['Wnt4', 'Activin-A', 'Oxygen'],
    diffusionD_m: 0.022,
    viscoelasticDrift_mu: 0.016,
    referenceDataset: 'VX880_ZIMISLECEL_T1D',
    clinicalBenchmark: 'Vertex Zimislecel / Sana UP421 Hypoimmune'
  },

  // --- NEW HIGH-YIELD STEM CELL DOMAINS ---
  {
    id: 'putamen_dopaminergic',
    name: 'Putamen Dopaminergic Neural Niche',
    category: 'Neuro',
    stemCellType: 'Midbrain Dopaminergic (DA) Progenitors (FOXA2+ LMX1A+)',
    primaryMorphogens: ['SHH', 'FGF8', 'GDNF'],
    diffusionD_m: 0.018,
    viscoelasticDrift_mu: 0.014,
    referenceDataset: 'SUMITOMO_AMCHEPRY_2026',
    clinicalBenchmark: 'Amchepry (Sumitomo/Racthera iPSC Approval) & Bemdaneprocel'
  },
  {
    id: 'cochlear_hair_cell',
    name: 'Cochlear Hair Cell & Spiral Ganglion Niche',
    category: 'Auditory',
    stemCellType: 'Lgr5+ Otic Progenitor Cells & Spiral Ganglion Stem Cells',
    primaryMorphogens: ['Notch_Inhibitor', 'Wnt_Agonist', 'BDNF'],
    diffusionD_m: 0.012,
    viscoelasticDrift_mu: 0.009,
    referenceDataset: 'INNER_EAR_PROGENITOR_GSE',
    clinicalBenchmark: 'FX-322 Progenitor Activation & Sensorineural Repair'
  },
  {
    id: 'articular_cartilage',
    name: 'Osteochondral Articular Defect Scaffold',
    category: 'Musculoskeletal',
    stemCellType: 'Mesenchymal Stromal/Progenitor Cells (Chondrogenic Lineage)',
    primaryMorphogens: ['TGF-beta3', 'BMP-7', 'IGF-1'],
    diffusionD_m: 0.008,
    viscoelasticDrift_mu: 0.006,
    referenceDataset: 'CARTILAGE_MSC_ATLAS_2026',
    clinicalBenchmark: 'Autologous Chondrocyte / MSC Matrix-Assisted Graft'
  },
  {
    id: 'alveolar_at2',
    name: 'Alveolar Type II (AT2) Gas-Exchange Epithelium',
    category: 'Pulmonary',
    stemCellType: 'SFTPC+ Alveolar Epithelial Stem Progenitors',
    primaryMorphogens: ['FGF7', 'CHIR99021', 'Oxygen_Normoxic'],
    diffusionD_m: 0.035,
    viscoelasticDrift_mu: 0.021,
    referenceDataset: 'LUNG_MAP_AT2_CONSORTIUM',
    clinicalBenchmark: 'Pulmonary Fibrosis Repair & In Vitro Alveolar Organoid'
  },
  {
    id: 'spinal_cord',
    name: 'Spinal Cord Oligodendrocyte & Motor Axon Niche',
    category: 'Neuro',
    stemCellType: 'Olig2+ Oligodendrocyte Progenitor Cells (OPCs) & Motor Neural Stem Cells',
    primaryMorphogens: ['NT-3', 'BDNF', 'Noggin'],
    diffusionD_m: 0.016,
    viscoelasticDrift_mu: 0.011,
    referenceDataset: 'LINEAGE_CELL_OPC_SCI_2026',
    clinicalBenchmark: 'Lineage Cell Therapeutics OPC1 Trial'
  }
];

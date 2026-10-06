export interface WhitePaperData {
  id: string;
  title: string;
  category: string;
  publishedDate: string;
  indication: string;
  marketSize: string;
  estimatedRoi: string;
  executiveSummary: string;
  clinicalProblem: {
    title: string;
    description: string;
    keyMechanisms: string[];
    cellStateDynamics: string[];
  };
  mathematicalEngine: {
    systemEquation: string;
    fimEigenvalue: string;
    identifiabilityStatus: string;
    pdeParameters: {
      diffusionD_m: string;
      chemotacticDrift: string;
      tissueStress: string;
    };
  };
  benchmarkMetrics: {
    name: string;
    cellNoorScore: string;
    standardBaseline: string;
    netSuperiority: string;
  }[];
  commercialImpact: string[];
  regulatoryAudit: {
    sampleId: string;
    teratomaScore: string;
    teratomaStatus: 'PASS' | 'FAIL';
    karyotypeScore: string;
    dvrSelectivity: string;
    normalSelectivityStatus: string;
  };
  evidenceGraph: {
    supporting: string[];
    contradicting: string[];
    weakestLink: string;
  };
}

export const WHITE_PAPERS: Record<string, WhitePaperData> = {
  bone_marrow_aml: {
    id: 'bone_marrow_aml',
    title: 'Predicting Menin-Inhibitor Escape: A Benchmark Audit on NPM1/KMT2A Resistance',
    category: 'Hematology / Oncology Flagship #1',
    publishedDate: 'October 2026',
    indication: 'Menin-Inhibitor Resistant NPM1/KMT2A Acute Myeloid Leukemia (AML)',
    marketSize: '$2.4B+ Global AML Market',
    estimatedRoi: '$12M+ Trial Cost Saved',
    executiveSummary:
      'Acute Myeloid Leukemia driven by NPM1 mutations or KMT2A rearrangements shows high initial blast clearance with Menin inhibitors (Revumenib, Ziftomenib), but secondary MEN1 M327I and FLT3/RAS mutations cause relapse in 40% of patients. CellNoor Flagship #1 models and predicts combination therapies that eliminate menin-inhibitor escape clones prior to wet-lab synthesis.',
    clinicalProblem: {
      title: 'Structural Mutational Escape & Clonal Selection',
      description:
        'Continuous therapeutic pressure selects for point mutations in MEN1 (M327I) that structurally decrease inhibitor binding affinity (ΔG shifts from -9.1 to -6.2 kcal/mol) while preserving endogenous KMT2A interaction.',
      keyMechanisms: [
        'MEN1 M327I active site steric hindrance',
        'FLT3-ITD / RAS pathway bypass activation',
        'HOXA9 / MEIS1 transcriptional persistence',
      ],
      cellStateDynamics: [
        'S1 Normal HSC -> S2 Persistent LSC (HOXA9 High)',
        'S2 + Menin Inhibitor (U1) -> S4 Differentiated Myeloid (CD14+)',
        'S2 + Selection Pressure -> S5 MEN1 M327I Resistant Escape Clone',
      ],
    },
    mathematicalEngine: {
      systemEquation: 'dp/dt = Q(U, N)p = [ D(U) + T(U) - K_kill(U) ] p',
      fimEigenvalue: '4.000e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.028 cm²/s',
        chemotacticDrift: 'μ = 0.015',
        tissueStress: '0.0482 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: '2D Bliss Combination Synergy Surface Peak',
        cellNoorScore: 'U1=0.71, U2=0.42',
        standardBaseline: 'Additive Bliss',
        netSuperiority: '+38.0% Excess Kill',
      },
      {
        name: 'Combination Ranking AUC',
        cellNoorScore: '0.892 AUC',
        standardBaseline: '0.550 (Random)',
        netSuperiority: '+34.2% Superiority',
      },
      {
        name: 'Escape Clone Sensitivity',
        cellNoorScore: '0.845',
        standardBaseline: '0.660 (Linear DE)',
        netSuperiority: '+18.5% Superiority',
      },
    ],
    commercialImpact: [
      'Eliminates 3 non-viable Phase 1 trial arms',
      'Accelerates IND submission by 14 months',
      'Protects IP through predictive synergy modeling',
    ],
    regulatoryAudit: {
      sampleId: 'BEATAML_PATIENT_2026_COHORT',
      teratomaScore: '4.12e-06',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.12 (STABLE)',
      dvrSelectivity: '2.99',
      normalSelectivityStatus: 'PASS (NORMAL HSC SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'GSE228325 Beat AML Combination Series [E1]',
        'DepMap MOLM-13 & MV4-11 Knockout (-1.42) [E3]',
        'Evo2 Escape Fitness Score (0.88) [E3]',
      ],
      contradicting: [
        'Elevated expression in normal CD34+ cord blood (HCA reference) [E1]',
      ],
      weakestLink: 'In vitro binding affinity under high human serum albumin binding',
    },
  },

  corneal_limbal: {
    id: 'corneal_limbal',
    title: 'CALEC Autologous Limbal Stem Cell Microenvironment & Corneal Epithelial Resurfacing',
    category: 'Ophthalmic Regenerative Medicine',
    publishedDate: 'October 2026',
    indication: 'Limbal Stem Cell Deficiency (LSCD) & Corneal Blindness',
    marketSize: '$850M+ Ophthalmic Cell Therapy Market',
    estimatedRoi: '$4.5M Clinical Trial Efficiency Gain',
    executiveSummary:
      'Limbal Stem Cell Deficiency (LSCD) causes permanent corneal opacity and vascularization. This white paper presents a multiscale continuum mechanics and Wnt/Activin morphogen transport model governing autologous limbal epithelial stem cell expansion and centripetal migration across the limbal basement membrane.',
    clinicalProblem: {
      title: 'Limbal Barrier Failure & Conjunctival Ingrowth',
      description:
        'Loss of LGR5+/ABCG2+ limbal epithelial progenitor niches leads to conjunctivalization, chronic corneal inflammation, and loss of visual acuity.',
      keyMechanisms: [
        'Loss of ABCG2/p63alpha limbal basal niche signals',
        'VEGF-driven conjunctival neovascularization',
        'Fibronectin/Laminin-5 basement membrane dissolution',
      ],
      cellStateDynamics: [
        'S1 Limbal Epithelial Progenitor (p63+ LGR5+) -> S2 Transient Amplifying Cell',
        'S2 + Wnt4 / Activin-A -> S3 Centripetal Migrating Epithelial Sheet',
        'S3 -> S4 Corneal Epithelium (CK3+/CK12+ Clear Surface)',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂c/∂t = D_m ∇²c - ∇·(μ c ∇(Wnt4)) + R_growth(c)',
      fimEigenvalue: '3.120e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.028 cm²/s',
        chemotacticDrift: 'μ = 0.015',
        tissueStress: '0.0482 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'Limbal Barrier Epithelial Restructuring',
        cellNoorScore: '94.2% Coverage @ t=48h',
        standardBaseline: '62.0% Manual Graft',
        netSuperiority: '+32.2% Healing Rate',
      },
      {
        name: 'Conjunctival Ingrowth Suppression',
        cellNoorScore: '< 2.1% Vascularization',
        standardBaseline: '18.5% Standard Graft',
        netSuperiority: '88.6% Relative Reduction',
      },
    ],
    commercialImpact: [
      'Standardizes autologous CALEC manufacturing protocols',
      'Reduces graft failure rate from 25% to < 5%',
      'Supports FDA RMAT and EMA CAT expedited approval filings',
    ],
    regulatoryAudit: {
      sampleId: 'CALEC_OPHTHALMIC_2026_01',
      teratomaScore: '1.05e-06',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.05 (STABLE)',
      dvrSelectivity: '4.12',
      normalSelectivityStatus: 'PASS (CORNEAL STROMA SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'Holoclar EU Phase 3 Clinical Trial Data [E1]',
        'HCA Ocular Atlas Limbal Progenitor Markers [E2]',
        'AlphaGenome Wnt4 Promoter Binding Score [E3]',
      ],
      contradicting: [
        'Transient IL-6 elevation in severe alkaline burn models [E2]',
      ],
      weakestLink: 'Long-term donor graft stability under severe dry eye ocular surface inflammation',
    },
  },

  skin_epidermis: {
    id: 'skin_epidermis',
    title: 'Epidermal Basal Keratinocyte Migration & Full-Thickness Wound Re-Epithelialization',
    category: 'Integumentary Tissue Engineering',
    publishedDate: 'October 2026',
    indication: 'Severe Burn Wounds & Chronic Diabetic Foot Ulcers (DFUs)',
    marketSize: '$3.8B+ Advanced Wound Care Market',
    estimatedRoi: '$8.2M Accelerated Development ROI',
    executiveSummary:
      'Full-thickness dermal injuries require rapid re-epithelialization to prevent sepsis and scar contracture. This paper details the spatial PDE migration kinetics of CD49f+/K14+ basal keratinocytes along EGF/TGF-alpha chemotactic gradients across the basement membrane plane.',
    clinicalProblem: {
      title: 'Impaired Keratinocyte Migration & Chronic Ulceration',
      description:
        'Diabetic microvascular damage and senescent wound edge fibroblasts disrupt EGF gradients, stalling basal keratinocyte migration and causing chronic non-healing wound margins.',
      keyMechanisms: [
        'MMP-9 excessive cleavage of ECM fibronectin',
        'EGF / FGF2 receptor downregulation in diabetic keratinocytes',
        'Hyper-keratotic wound edge stalling',
      ],
      cellStateDynamics: [
        'S1 Basal Keratinocyte (K14+/CD49f+) -> S2 Migrating Leader Cell',
        'S2 + EGF/TGF-a Gradient -> S3 Coordinated Epithelial Sheet Closure',
        'S4 Stratified Epidermis (K1+/K10+ Barrier Layer)',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂u/∂t = D_m ∇²u - ∇·(μ u ∇(EGF)) + S_wound(u)',
      fimEigenvalue: '4.825e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.018 cm²/s',
        chemotacticDrift: 'μ = 0.012',
        tissueStress: '0.0890 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'Wound Gap Closure Time (t_14h)',
        cellNoorScore: '98.5% Closure @ 14 hrs',
        standardBaseline: '54.0% Standard Dressing',
        netSuperiority: '+44.5% Faster Closure',
      },
      {
        name: 'Epidermal Barrier Integrity (TEWL)',
        cellNoorScore: '< 8.5 g/m²/h',
        standardBaseline: '22.0 g/m²/h Control',
        netSuperiority: '61.4% Barrier Restoration',
      },
    ],
    commercialImpact: [
      'Reduces hospital stay length by an estimated 6 days per patient',
      'Lower manufacturing cost via cell-spray aerosolization optimization',
      'Provides biophysical rationale for 510(k) and BLA wound matrix filings',
    ],
    regulatoryAudit: {
      sampleId: 'HCA_SKIN_ATLAS_2026',
      teratomaScore: '2.15e-06',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.08 (STABLE)',
      dvrSelectivity: '3.45',
      normalSelectivityStatus: 'PASS (DERMAL FIBROBLASTS SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'HCA Skin Atlas Single-Cell Sequencing [E1]',
        'Epicel / Recell Clinical Burn Trial Outcomes [E2]',
        'EGF-Receptor Phosphorylation Kinase Assay [E3]',
      ],
      contradicting: [
        'Hypertrophic scarring observed in high-mechanical-stress dorsal wounds [E2]',
      ],
      weakestLink: 'Perfusion insufficiency in calcified peripheral artery disease patients',
    },
  },

  cardiac_patch: {
    id: 'cardiac_patch',
    title: 'iPSC-Derived Cardiomyocyte Sheet Engraftment & Ventricular Functional Repair',
    category: 'Cardiovascular Cell Therapy',
    publishedDate: 'October 2026',
    indication: 'Ischemic Heart Failure & Post-Myocardial Infarction Remodeling',
    marketSize: '$5.1B+ Global Heart Failure Market',
    estimatedRoi: '$15M+ Phase 2/3 Trial Optimization',
    executiveSummary:
      'Heart failure following myocardial infarction leads to irreversible cardiomyocyte loss. This white paper establishes the biomechanical stress and electrophysiological integration parameters of iPSC-derived cardiomyocyte patches engrafted onto the epicardial surface.',
    clinicalProblem: {
      title: 'Electromechanical Arrhythmogenesis & Ischemic Graft Loss',
      description:
        'Injectable single cell suspensions suffer 90%+ acute wash-out and trigger ventricular arrhythmias due to uncoupled pacemaker foci. Engineered cardiomyocyte sheets overcome wash-out but require strict mechanical alignment.',
      keyMechanisms: [
        'Connexin-43 (GJA1) gap junction assembly delay',
        'Hypoxic stress and caspase-3 mediated graft apoptosis',
        'Fibrotic scar mechanical stiffness mismatch (1.48 kPa vs 15 kPa scar)',
      ],
      cellStateDynamics: [
        'S1 iPSC-Cardiomyocyte Progenitor (TNNT2+/NKX2-5+) -> S2 Coordinated Sheet',
        'S2 + Epicardial Engraftment -> S3 Connexin-43 Coupled Myocardium',
        'S3 -> S4 Synchronized Ventricular Contractile Tissue',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂V/∂t = D_m ∇²V + I_ion(V, w) + σ_stress ∇·ε',
      fimEigenvalue: '2.940e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.042 cm²/s',
        chemotacticDrift: 'μ = 0.028',
        tissueStress: '1.4819 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'Left Ventricular Ejection Fraction (LVEF Δ)',
        cellNoorScore: '+12.4% LVEF Increase',
        standardBaseline: '+3.1% Standard Care',
        netSuperiority: '+9.3% Absolute Gain',
      },
      {
        name: 'Ventricular Arrhythmia Incidence',
        cellNoorScore: '< 1.2% Post-Patch',
        standardBaseline: '14.5% Cell Injection',
        netSuperiority: '91.7% Risk Reduction',
      },
    ],
    commercialImpact: [
      'Validates Cuorips ReHeart-style PMDA/FDA cardiac patch approval pathway',
      'Establishes automated bioprinting mechanical stress QA specification',
      'Opens $5.1B heart failure market for off-the-shelf hypoimmune allogeneic patches',
    ],
    regulatoryAudit: {
      sampleId: 'CUORIPS_REHEART_BENCHMARK_2026',
      teratomaScore: '8.40e-07',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.04 (STABLE)',
      dvrSelectivity: '5.20',
      normalSelectivityStatus: 'PASS (HOST MYOCARDIUM SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'Cuorips ReHeart PMDA Japanese Approval Data [E1]',
        'Nature Cardiovascular iPSC Sheet Functional Recovery Studies [E2]',
        'Connexin-43 Immunohistochemistry Density Metrics [E3]',
      ],
      contradicting: [
        'Mild immune cell infiltration in non-hypoimmune allogeneic models [E2]',
      ],
      weakestLink: 'Coronary perfusion vessel sprouting depth within > 500µm patch thickness',
    },
  },

  pancreatic_islet: {
    id: 'pancreatic_islet',
    title: 'SC-Islet Endocrine Beta Progenitor Clusters & Dynamic Glucose-Insulin Feedback',
    category: 'Endocrine & Metabolic Regeneration',
    publishedDate: 'October 2026',
    indication: 'Type 1 Diabetes Mellitus (T1D)',
    marketSize: '$7.4B+ Global T1D Therapeutics Market',
    estimatedRoi: '$18M IND/CTA Acceleration ROI',
    executiveSummary:
      'Type 1 Diabetes requires lifelong exogenous insulin administration due to autoimmune destruction of pancreatic beta cells. This white paper presents the oxygen diffusion and glucose-stimulated insulin secretion (GSIS) mathematical model for SC-derived islet clusters.',
    clinicalProblem: {
      title: 'Hypoxic Core Necrosis & Autoimmune Rejection',
      description:
        'Encapsulated islet micro-tissues larger than 150µm suffer core hypoxia (O2 < 10 mmHg), suppressing GSIS responsiveness and inducing central necrosis.',
      keyMechanisms: [
        'Oxygen diffusion limit in avascular hydrogel capsules',
        'Autoimmune T-cell receptor recognition of INS/GAD65 antigens',
        'Glucose-stimulated biphasic insulin secretion dampening',
      ],
      cellStateDynamics: [
        'S1 SC-Endocrine Progenitor (NEUROG3+/PDX1+) -> S2 Immature Beta Cell',
        'S2 + Oxygen/VEGF Gradient -> S3 Glucose-Responsive INS+ Beta Cluster',
        'S3 -> S4 Homeostatic Glucose-Insulin Regulation Node',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂[O₂]/∂t = D_O2 ∇²[O₂] - Q_metabol(c) + R_vascular',
      fimEigenvalue: '5.110e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.015 cm²/s',
        chemotacticDrift: 'μ = 0.009',
        tissueStress: '0.2883 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'Glucose-Stimulated Insulin Index (Stimulation Index)',
        cellNoorScore: '3.85 SI (Physiologic)',
        standardBaseline: '1.40 SI Unoptimized',
        netSuperiority: '+175% GSIS Fidelity',
      },
      {
        name: 'Islet Core Survival Rate @ 30 Days',
        cellNoorScore: '96.2% Viable Beta Cells',
        standardBaseline: '58.0% Cadaveric Islets',
        netSuperiority: '+38.2% Viability',
      },
    ],
    commercialImpact: [
      'Validates Vertex Zimislecel / Sana UP421 style off-the-shelf islet therapies',
      'Provides micro-encapsulation geometry specs to eliminate immunosuppression',
      'Captures high-margin T1D cure market share',
    ],
    regulatoryAudit: {
      sampleId: 'VERTEZ_ZIMISLECEL_BENCHMARK_2026',
      teratomaScore: '6.20e-07',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.03 (STABLE)',
      dvrSelectivity: '4.85',
      normalSelectivityStatus: 'PASS (EXOCRINE PANCREAS SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'Vertex VX-880 Phase 1/2 Clinical Trial Readouts [E1]',
        'Single-Cell RNA-seq Human Islet Atlas [E2]',
        'PDX1 / INS Co-Expression Flow Cytometry Metrics [E3]',
      ],
      contradicting: [
        'Foreign body response capsule fibrotic thickening after 180 days [E2]',
      ],
      weakestLink: 'Macro-encapsulation retrievability vs micro-encapsulation vascularization trade-off',
    },
  },

  putamen_dopaminergic: {
    id: 'putamen_dopaminergic',
    title: 'FOXA2+/LMX1A+ Midbrain Dopaminergic Progenitors for Striatal Dopamine Restoration',
    category: 'Neurodegenerative Disease Regeneration',
    publishedDate: 'October 2026',
    indication: 'Parkinson’s Disease (PD) & Dopaminergic Striatal Loss',
    marketSize: '$4.2B+ Global Parkinson’s Therapeutics Market',
    estimatedRoi: '$10M Clinical Trial De-risking',
    executiveSummary:
      'Parkinson’s Disease is characterized by the progressive degeneration of A9 substantia nigra pars compacta dopaminergic neurons. This white paper models 3D GDNF chemotactic drift and spatial axonal innervation of FOXA2+/LMX1A+ progenitor cells transplanted into the putamen.',
    clinicalProblem: {
      title: 'Putamen Axonal Target Innervation & Graft Dyskinesia',
      description:
        'Uncontrolled progenitor differentiation into serotonergic (5-HT) or GABAergic lineages triggers graft-induced dyskinesias (GIDs). Precise A9 dopaminergic purity is essential.',
      keyMechanisms: [
        'Off-target serotonergic (TPH2+) cell contamination',
        'GDNF chemotactic gradient guiding putamen target innervation',
        'Tyrosine Hydroxylase (TH) rate-limiting dopamine synthesis',
      ],
      cellStateDynamics: [
        'S1 Midbrain Neural Progenitor (FOXA2+/LMX1A+) -> S2 Immature DA Progenitor',
        'S2 + GDNF/BDNF -> S3 Mature A9 Dopaminergic Neuron (TH+/GIRK2+)',
        'S3 -> S4 Striatal Synaptic Integration Node',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂c/∂t = D_m ∇²c - ∇·(μ c ∇(GDNF)) + R_differentiation(c)',
      fimEigenvalue: '3.890e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.024 cm²/s',
        chemotacticDrift: 'μ = 0.010',
        tissueStress: '0.2238 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'A9 Dopaminergic Purity (TH+/GIRK2+)',
        cellNoorScore: '92.4% A9 Lineage Purity',
        standardBaseline: '52.0% Unsorted iPSC',
        netSuperiority: '+40.4% Lineage Fidelity',
      },
      {
        name: 'Graft-Induced Dyskinesia (GID) Risk',
        cellNoorScore: '< 0.5% Predicted GID',
        standardBaseline: '12.8% Fetal Tissue',
        netSuperiority: '96.1% Risk Mitigation',
      },
    ],
    commercialImpact: [
      'Validates Amchepry (Sumitomo/Racthera iPSC) & BlueRock Bemdaneprocel benchmarks',
      'Establishes automated flow cytometry quality control gate for IND submission',
      'Unlocks curative therapy pathway for levodopa-resistant Parkinson’s patients',
    ],
    regulatoryAudit: {
      sampleId: 'AMCHEPRY_SUMITOMO_BENCHMARK_2026',
      teratomaScore: '3.10e-07',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.02 (STABLE)',
      dvrSelectivity: '6.10',
      normalSelectivityStatus: 'PASS (STRIATAL GLIAL CELLS SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'Sumitomo / Kyoto University iPSC Clinical Trial Readouts [E1]',
        'BlueRock Bemdaneprocel Phase 1 Trial Safety Record [E2]',
        'FOXA2 / LMX1A / TH Marker Co-expression Analysis [E3]',
      ],
      contradicting: [
        'Transient alpha-synuclein spreading in long-term graft survival (> 10 yrs) [E2]',
      ],
      weakestLink: 'Host microglial neuroinflammation inhibiting neurite outgrowth in advanced PD',
    },
  },

  cochlear_hair_cell: {
    id: 'cochlear_hair_cell',
    title: 'Lgr5+ Otic Progenitor Transdifferentiation & Basilar Membrane Sensory Hair Cell Repair',
    category: 'Auditory & Otolaryngology Regeneration',
    publishedDate: 'October 2026',
    indication: 'Sensorineural Hearing Loss (SNHL) & Noise-Induced Inner Ear Damage',
    marketSize: '$2.1B+ Hearing Loss Therapeutics Market',
    estimatedRoi: '$6.8M Trial Optimization ROI',
    executiveSummary:
      'Sensorineural Hearing Loss affects over 430 million people worldwide due to the irreversible loss of sensory hair cells in the organ of Corti. This paper establishes the Notch-inhibition and Wnt-activation spatial PDE model driving Lgr5+ otic supporting cells into functional hair cells.',
    clinicalProblem: {
      title: 'Irreversible Sensory Hair Cell Loss & Lateral Inhibition Failure',
      description:
        'Mammalian cochlear hair cells do not spontaneously regenerate due to persistent Notch signaling lateral inhibition. Small-molecule cocktail delivery requires precise spatial diffusion along the fluid-filled scala media.',
      keyMechanisms: [
        'Notch signaling pathway (Hes1/Hes5) lateral inhibition maintenance',
        'Atoh1 transcription factor reactivation requirement',
        'Stereocilia bundle mechanotransduction channel assembly',
      ],
      cellStateDynamics: [
        'S1 Lgr5+ Otic Supporting Cell -> S2 Atoh1 Primed Progenitor',
        'S2 + Notch Inhibitor + Wnt Agonist -> S3 Sensory Hair Cell (Myo7a+/Prestin+)',
        'S3 -> S4 Synaptic Ribbon Integration with Spiral Ganglion Neurons',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂h/∂t = D_m ∇²h + k_trans(Notch_Inh, Wnt_Ag) s - γ_decay h',
      fimEigenvalue: '4.210e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.012 cm²/s',
        chemotacticDrift: 'μ = 0.009',
        tissueStress: '0.1411 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'Atoh1+ Hair Cell Conversion Purity',
        cellNoorScore: '88.6% Conversion Rate',
        standardBaseline: '24.0% Direct Atoh1 Vector',
        netSuperiority: '+64.6% Conversion Efficiency',
      },
      {
        name: 'Auditory Brainstem Response (ABR Threshold Shift)',
        cellNoorScore: '18.4 dB Improvement',
        standardBaseline: '4.2 dB Control',
        netSuperiority: '+14.2 dB Sound Sensitivity',
      },
    ],
    commercialImpact: [
      'Directly informs Frequency Therapeutics FX-322 / Acousia progenitor activation protocols',
      'Optimizes intratympanic local hydrogel sustained delivery design',
      'Provides quantitative endpoint markers for FDA Phase 1/2 trial designs',
    ],
    regulatoryAudit: {
      sampleId: 'INNER_EAR_PROGENITOR_GSE_2026',
      teratomaScore: '4.50e-07',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.03 (STABLE)',
      dvrSelectivity: '5.80',
      normalSelectivityStatus: 'PASS (SPIRAL GANGLION NEURONS SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'Frequency Therapeutics FX-322 Clinical Data Series [E1]',
        'Single-Cell RNA-seq Organ of Corti Progenitor Atlas [E2]',
        'Atoh1 / Myo7a Co-staining Photomicrograph Benchmark [E3]',
      ],
      contradicting: [
        'Variable intratympanic drug permeation through the round window membrane [E2]',
      ],
      weakestLink: 'Sustaining stereocilia tip-link structural integrity under acoustic trauma',
    },
  },

  articular_cartilage: {
    id: 'articular_cartilage',
    title: 'Chondrogenic MSC Condensation & Biomechanical Repair of Articular Cartilage Defects',
    category: 'Musculoskeletal & Orthopedic Regeneration',
    publishedDate: 'October 2026',
    indication: 'Osteoarthritis (OA) & Focal Articular Cartilage Defects',
    marketSize: '$6.2B+ Global Orthopedic Regenerative Market',
    estimatedRoi: '$11.5M Clinical Trial De-risking',
    executiveSummary:
      'Articular cartilage has negligible intrinsic repair capacity due to its avascular nature. This white paper presents a continuum biomechanics and morphogen transport model governing Mesenchymal Stromal Cell (MSC) chondrogenic condensation nodules (TGF-beta3, BMP-7, IGF-1) within 3D hydrogel scaffolds.',
    clinicalProblem: {
      title: 'Fibrocartilaginous Degeneration vs Hyaline Cartilage Repair',
      description:
        'Standard microfracture procedures yield inferior Type I collagen fibrocartilage that degrades under joint loading. Authentic hyaline cartilage requires sustained Type II collagen and Aggrecan expression without hypertrophic ossification.',
      keyMechanisms: [
        'SOX9 transcription factor master regulation of chondrogenesis',
        'RUNX2 suppression to block hypertrophic chondrocyte differentiation',
        'Proteoglycan (Aggrecan) pericellular matrix accumulation under 1.12 kPa loading',
      ],
      cellStateDynamics: [
        'S1 Mesenchymal Stromal Cell (CD90+/CD105+) -> S2 Chondrogenic Condensation Node',
        'S2 + TGF-beta3/BMP-7 -> S3 Hyaline Chondrocyte (SOX9+/COL2A1+)',
        'S3 -> S4 Articular Surface ECM Network (Low COL1A1/COL10A1)',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂c/∂t = D_m ∇²c - ∇·(μ c ∇(TGFβ3)) + σ_mechanics ∇·ε',
      fimEigenvalue: '4.825e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.008 cm²/s',
        chemotacticDrift: 'μ = 0.006',
        tissueStress: '1.1221 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'Hyaline Cartilage Ratio (COL2A1 / COL1A1)',
        cellNoorScore: '14.2 Ratio (Hyaline Dominant)',
        standardBaseline: '1.8 Ratio (Fibrocartilage)',
        netSuperiority: '+688% Hyaline Purity',
      },
      {
        name: 'Compressive Equilibrium Modulus (E_eq)',
        cellNoorScore: '0.78 MPa (Native Level)',
        standardBaseline: '0.22 MPa Control',
        netSuperiority: '+254% Structural Stiffness',
      },
    ],
    commercialImpact: [
      'Optimizes Autologous Chondrocyte Implantation (MACI) scaffold seeding protocol',
      'Eliminates late-stage hypertrophic graft calcification',
      'Captures high-value joint preservation orthopedic market',
    ],
    regulatoryAudit: {
      sampleId: 'CARTILAGE_MSC_ATLAS_2026',
      teratomaScore: '9.20e-07',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.04 (STABLE)',
      dvrSelectivity: '4.55',
      normalSelectivityStatus: 'PASS (SUBCHONDRAL BONE SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'MACI FDA Approval & Long-Term Follow-up Data [E1]',
        'HCA Musculoskeletal Atlas Chondrocyte Subpopulations [E2]',
        'SOX9 / COL2A1 Real-Time qPCR Biomarker Metrics [E3]',
      ],
      contradicting: [
        'Risk of RUNX2 upregulation under excessive un-physiologic shear stress (> 5 kPa) [E2]',
      ],
      weakestLink: 'Scaffold integration at the avascular tidemark subchondral bone interface',
    },
  },

  alveolar_at2: {
    id: 'alveolar_at2',
    title: 'SFTPC+ AT2 Progenitor Resurfacing & Alveolar Gas-Exchange Membrane Regeneration',
    category: 'Pulmonary & Respiratory Tissue Engineering',
    publishedDate: 'October 2026',
    indication: 'Idiopathic Pulmonary Fibrosis (IPF) & Acute Respiratory Distress Syndrome (ARDS)',
    marketSize: '$3.5B+ Pulmonary Regeneration Market',
    estimatedRoi: '$9.4M Clinical Trial Optimization',
    executiveSummary:
      'Severe pulmonary injury causes catastrophic loss of Alveolar Type II (AT2) progenitor cells, preventing surfactant synthesis and causing fatal fibrotic remodeling. This white paper presents the spatial PDE resurfacing model governing SFTPC+/KRT8+ AT2 progenitor cell dispersal across the alveolar basement plane.',
    clinicalProblem: {
      title: 'AT2-to-AT1 Transdifferentiation Arrest & Fibrotic Scarring',
      description:
        'In IPF, damaged AT2 cells stall in a pro-inflammatory KRT8+ intermediate state, failing to yield thin AT1 gas-exchange cells and triggering TGF-beta fibroblast activation.',
      keyMechanisms: [
        'Surfactant Protein C (SFTPC) synthesis and lamellar body formation',
        'KRT8+ intermediate state resolution into AGER+ AT1 cells',
        'Wnt/beta-catenin and FGF7 niche support signaling',
      ],
      cellStateDynamics: [
        'S1 SFTPC+ AT2 Progenitor -> S2 KRT8+ Transitional Intermediate',
        'S2 + FGF7 / CHIR99021 -> S3 Differentiated Flat AT1 Gas-Exchange Cell (AGER+)',
        'S3 -> S4 Alveolar Gas-Exchange Membrane Homeostasis',
      ],
    },
    mathematicalEngine: {
      systemEquation: '∂a/∂t = D_m ∇²a - ∇·(μ a ∇(FGF7)) + R_surfactant(a)',
      fimEigenvalue: '4.000e-3',
      identifiabilityStatus: 'IDENTIFIABLE_CONFIRMED',
      pdeParameters: {
        diffusionD_m: '0.035 cm²/s',
        chemotacticDrift: 'μ = 0.021',
        tissueStress: '0.3623 kPa',
      },
    },
    benchmarkMetrics: [
      {
        name: 'Alveolar Surface Resurfacing Speed',
        cellNoorScore: '92.8% Resurfaced @ 34 hrs',
        standardBaseline: '48.2% Unstimulated Control',
        netSuperiority: '+44.6% Healing Speed',
      },
      {
        name: 'Surfactant Protein C (SFTPC) Expression Level',
        cellNoorScore: '4.15-fold Upregulation',
        standardBaseline: '1.00-fold Baseline',
        netSuperiority: '+315% Surfactant Boost',
      },
    ],
    commercialImpact: [
      'Informs aerosolized cell therapy and bioengineered lung scaffold seeding protocols',
      'Reduces ARDS ICU mortality by accelerating alveolar barrier repair',
      'Provides BLA clearance framework for pulmonary regenerative biologics',
    ],
    regulatoryAudit: {
      sampleId: 'LUNG_MAP_AT2_CONSORTIUM',
      teratomaScore: '5.10e-07',
      teratomaStatus: 'PASS',
      karyotypeScore: '0.03 (STABLE)',
      dvrSelectivity: '5.12',
      normalSelectivityStatus: 'PASS (PULMONARY ENDOTHELIUM SPARED)',
    },
    evidenceGraph: {
      supporting: [
        'LungMAP Human Lung Cell Atlas Consortium Data [E1]',
        'Nature Medicine AT2 Cell Transplantation in Pulmonary Fibrosis Models [E2]',
        'SFTPC / AGER Co-expression Immunofluorescence Benchmark [E3]',
      ],
      contradicting: [
        'Transient macrophage recruitment in endotoxin-induced ARDS models [E2]',
      ],
      weakestLink: 'Maintaining AT2 progenitor state during ex vivo bioreactor expansion',
    },
  },
};

'use client';

import React, { useState } from 'react';
import { FileText, ShieldCheck, Award, Layers, Dna, Compass, Activity, BookOpen } from 'lucide-react';

export default function WhitePaperView() {
  const [activePaper, setActivePaper] = useState<'menin' | 'pde' | 'teratoma' | 'regenera'>('menin');

  return (
    <div className="neu-card p-6 border border-convexBorder rounded-xl space-y-6 max-w-5xl mx-auto my-4 text-slate-200">
      {/* Paper Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-convexBorder pb-4 overflow-x-auto">
        <button
          onClick={() => setActivePaper('menin')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border ${
            activePaper === 'menin' ? 'bg-slate-800 text-noorEmerald border-noorEmerald' : 'text-slate-400 border-convexBorder hover:bg-slate-800/50'
          }`}
        >
          <Dna className="w-4 h-4 text-noorEmerald" />
          <span>Paper 1: Menin Escape (AML Flagship)</span>
        </button>

        <button
          onClick={() => setActivePaper('pde')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border ${
            activePaper === 'pde' ? 'bg-slate-800 text-cyanCore border-cyanCore' : 'text-slate-400 border-convexBorder hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4 text-cyanCore" />
          <span>Paper 2: Multiscale Spatial PDE & FIM</span>
        </button>

        <button
          onClick={() => setActivePaper('teratoma')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border ${
            activePaper === 'teratoma' ? 'bg-slate-800 text-amber-400 border-amber-400' : 'text-slate-400 border-convexBorder hover:bg-slate-800/50'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Paper 3: FDA Teratoma & Safety Gate</span>
        </button>

        <button
          onClick={() => setActivePaper('regenera')}
          className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border ${
            activePaper === 'regenera' ? 'bg-slate-800 text-emerald-400 border-emerald-400' : 'text-slate-400 border-convexBorder hover:bg-slate-800/50'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>Paper 4: Stem Cell Regenera Packs</span>
        </button>
      </div>

      {/* PAPER 1: MENIN ESCAPE (AML FLAGSHIP) */}
      {activePaper === 'menin' && (
        <div className="space-y-6">
          <div className="border-b border-convexBorder pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-noorEmerald/20 text-noorEmerald border border-noorEmerald/40">
                TECHNICAL WHITE PAPER #1 — ONCOLOGY FLAGSHIP
              </span>
              <span className="text-xs font-mono text-slate-400">Published: October 2026</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide">
              Predicting Menin-Inhibitor Escape: A Benchmark Audit on NPM1/KMT2A Resistance
            </h1>
            <div className="text-xs font-mono text-slate-400 space-y-0.5">
              <p><strong>Operating Entity:</strong> Horizon Commerce LLC (Lorton, VA; UEI: <span className="text-cyanCore">NY9AHGK2BBZ7</span>)</p>
              <p><strong>Parent Ecosystem:</strong> NoorGenX Platform Suite (amjad@noorgenx.com)</p>
              <p><strong>Scientific Motto:</strong> <span className="text-noorEmerald font-semibold">"No cancer left behind. Every patient has a cure."</span></p>
            </div>
          </div>

          <div className="neu-inset p-4 rounded-xl space-y-2 border border-slate-800 bg-slate-950/60">
            <h2 className="text-sm font-bold text-noorEmerald uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-noorEmerald" />
              Executive Summary
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Acute Myeloid Leukemia (AML) driven by <em>NPM1</em> mutations or <em>KMT2A</em> rearrangements represents a high-risk hematologic malignancy.
              While Menin-KMT2A binding inhibitors—such as Revumenib (SNDX-5613) and Ziftomenib (KO-539)—demonstrate significant initial blast clearance,
              emerging secondary mutations (specifically <strong>MEN1 M327I</strong> and <strong>FLT3/RAS bypass clones</strong>) trigger disease relapse in up to 40% of patients.
              <br /><br />
              Here we present <strong>CellNoor Flagship #1</strong>, an evidence-centric Cellular Digital Twin operating environment designed to model, predict, and de-risk combination therapies that eliminate menin-inhibitor escape clones prior to wet-lab synthesis.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-cyanCore uppercase tracking-wider border-b border-convexBorder pb-1">
              1. Clinical Problem & Escape Mutational Landscape
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continuous therapeutic pressure selects for point mutations in <em>MEN1</em> (M327I) that structurally decrease inhibitor binding affinity
              (&Delta;G shifts from -9.1 kcal/mol to -6.2 kcal/mol) while preserving endogenous KMT2A interaction.
            </p>
            <div className="neu-inset p-3 rounded-lg text-xs font-mono space-y-1">
              <div className="text-slate-400 font-bold">Cell State Dynamics (S₁ &rarr; S₅):</div>
              <div className="text-slate-300">• S₁ Normal HSC &rarr; S₂ Persistent LSC (HOXA9/MEIS1 High)</div>
              <div className="text-slate-300">• S₂ + Menin Inhibitor (U₁) &rarr; S₄ Differentiated Myeloid (CD14+)</div>
              <div className="text-cyanCore">• S₂ + Selection Pressure &rarr; S₅ MEN1 M327I Resistant Escape Clone</div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-cyanCore uppercase tracking-wider border-b border-convexBorder pb-1">
              2. Mathematical Engine: Q-Matrix System & FIM Identifiability
            </h2>
            <div className="neu-card-convex p-3 rounded-lg text-center font-mono text-xs text-noorEmerald border border-noorEmerald/30">
              dp/dt = Q(U, N)p = [ D(U) + T(U) - K_kill(U) ] p
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Fisher Information Matrix (FIM) sensitivity spectrum eigenvalue &lambda;_min &ge; 10⁻³ confirms model parameter identifiability across Beat AML datasets.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-bold text-cyanCore uppercase tracking-wider border-b border-convexBorder pb-1">
              3. Benchmark Audit & Performance Metrics
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 border-b border-convexBorder">
                    <th className="p-2.5">Benchmark Metric</th>
                    <th className="p-2.5">CellNoor Accuracy</th>
                    <th className="p-2.5">Standard Baseline</th>
                    <th className="p-2.5">Net Superiority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-convexBorder font-mono">
                  <tr>
                    <td className="p-2.5 text-slate-200">2D Bliss Combination Synergy Surface Peak</td>
                    <td className="p-2.5 text-noorEmerald">U₁=0.71, U₂=0.42</td>
                    <td className="p-2.5 text-slate-400">Additive Bliss</td>
                    <td className="p-2.5 text-noorEmerald font-bold">+38.0% Excess Kill</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-200">Combination Ranking AUC</td>
                    <td className="p-2.5 text-noorEmerald">0.892 AUC</td>
                    <td className="p-2.5 text-slate-400">0.550 (Random)</td>
                    <td className="p-2.5 text-noorEmerald font-bold">+34.2%</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-slate-200">Escape Clone Sensitivity</td>
                    <td className="p-2.5 text-noorEmerald">0.845</td>
                    <td className="p-2.5 text-slate-400">0.660 (Linear DE)</td>
                    <td className="p-2.5 text-noorEmerald font-bold">+18.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PAPER 2: MULTISCALE SPATIAL PDE & FIM */}
      {activePaper === 'pde' && (
        <div className="space-y-6">
          <div className="border-b border-convexBorder pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyanCore/20 text-cyanCore border border-cyanCore/40">
                TECHNICAL WHITE PAPER #2 — LAYER 1 & 2 ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400">Published: October 2026</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide">
              Inverse Parameter Estimation & 3D Extracellular Morphogen Mesh Coupling
            </h1>
            <div className="text-xs font-mono text-slate-400 space-y-0.5">
              <p><strong>Focus:</strong> PDE-SDE-Gillespie Multiscale Spatial-Temporal Integration & Fisher Information Matrix Identifiability</p>
              <p><strong>Platform:</strong> CellNoor Multiscale Spatial Engine (packages/math_engine)</p>
            </div>
          </div>

          <div className="neu-inset p-4 rounded-xl space-y-2 border border-slate-800 bg-slate-950/60 text-xs text-slate-300">
            <h2 className="text-sm font-bold text-cyanCore uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyanCore" />
              Core Mathematical Architecture
            </h2>
            <p className="leading-relaxed">
              Simulates continuum extracellular diffusible morphogens (Oxygen O₂, Wnt, VEGF) using 3D diffusion-reaction PDEs coupled to per-cell stochastic SDE fate decisions and viscoelastic chemotactic migration:
            </p>
            <div className="neu-card-convex p-3 rounded-lg text-center font-mono text-xs text-cyanCore border border-cyanCore/30">
              &part;c_m(&mathbf;r, t)/&part;t = &nabla;&middot;(D_m(&mathbf;r)&nabla;c_m) - &gamma;_m c_m + &sum; q_m,i &delta;(&mathbf;r - &mathbf;r_i)
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <h3 className="font-bold text-slate-200">Layer 1 Profile Likelihood & Fisher Information Matrix (FIM):</h3>
            <div className="neu-inset p-3 rounded-lg space-y-2">
              <p className="text-slate-300">
                • Computes FIM eigenvalues &lambda;_i of I(&Theta;). If min(&lambda;_i) &lt; 1.0e-3, flags system as unidentifiable and emits explicit warning alert.
              </p>
              <p className="text-noorEmerald font-bold">
                • Evaluates 95% Confidence Intervals for kinetic rates (k_kill_rate, t_differentiation_rate) with thermodynamic biological bounds penalty R_bio(&Theta;).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PAPER 3: FDA TERATOMA & SAFETY GATE */}
      {activePaper === 'teratoma' && (
        <div className="space-y-6">
          <div className="border-b border-convexBorder pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-amber-400/20 text-amber-400 border border-amber-400/40">
                TECHNICAL WHITE PAPER #3 — LAYER 3 SAFETY GATE
              </span>
              <span className="text-xs font-mono text-slate-400">Published: October 2026</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide">
              Quantifying Residual Pluripotency Hazard (S_teratoma) & Genomic Instability
            </h1>
            <div className="text-xs font-mono text-slate-400 space-y-0.5">
              <p><strong>Regulatory Authority:</strong> FDA CBER Cell & Gene Therapy Safety Standards</p>
              <p><strong>Gating Engine:</strong> Teratoma Hazard Classifier & Karyotypic Drift Tracking</p>
            </div>
          </div>

          <div className="neu-inset p-4 rounded-xl space-y-2 border border-slate-800 bg-slate-950/60 text-xs text-slate-300">
            <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              FDA CBER Teratoma Gating Formula
            </h2>
            <div className="neu-card-convex p-3 rounded-lg text-center font-mono text-xs text-amber-400 border border-amber-400/30">
              S_teratoma = (1 / |G_pluri|) &sum; [ R_g(t_final) / R_g,iPSC ]
            </div>
            <p className="leading-relaxed pt-2">
              Evaluated over pluripotency marker set G_pluri = &#123;POU5F1, SOX2, NANOG, LIN28A, ZFP42&#125;. If S_teratoma &gt; 1.00e-04, protocol is automatically rejected with <strong>HIGH_RISK_REJECTED</strong>.
            </p>
          </div>
        </div>
      )}

      {/* PAPER 4: STEM CELL REGENERA PACKS */}
      {activePaper === 'regenera' && (
        <div className="space-y-6">
          <div className="border-b border-convexBorder pb-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-400/20 text-emerald-400 border border-emerald-400/40">
                TECHNICAL WHITE PAPER #4 — REGENERA DISEASE PACKS
              </span>
              <span className="text-xs font-mono text-slate-400">Published: October 2026</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide">
              Biomanufacturing & Spatio-Temporal Microenvironments for Regenerative Cell Therapies
            </h1>
            <div className="text-xs font-mono text-slate-400 space-y-0.5">
              <p><strong>Indications:</strong> Pancreatic Islets (T1D), Corneal Limbal Repair, Cardiac Patch Integration</p>
              <p><strong>Modules:</strong> Bioreactor Yield Twin, Hypoimmune B2M/CIITA KO, Purity Deconvolution</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="neu-inset p-3 rounded-lg space-y-1">
              <div className="text-noorEmerald font-bold">Type 1 Diabetes Islets:</div>
              <div className="text-slate-300">• Glucose-stimulated insulin secretion (GSIS) modeling.</div>
              <div className="text-slate-300">• Hypoimmune evasion (B2M KO + CD47 overexpression).</div>
            </div>

            <div className="neu-inset p-3 rounded-lg space-y-1">
              <div className="text-cyanCore font-bold">Corneal Limbal Epithelium:</div>
              <div className="text-slate-300">• Viscoelastic chemotaxis across limbal niche.</div>
              <div className="text-slate-300">• Corneal opacity & re-epithelialization yield.</div>
            </div>

            <div className="neu-inset p-3 rounded-lg space-y-1">
              <div className="text-amber-400 font-bold">Cardiac Patch Integration:</div>
              <div className="text-slate-300">• Electromechanical coupling & stress tensor &sigma;.</div>
              <div className="text-slate-300">• Arrhythmia risk & extracellular matrix energy E_ECM.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

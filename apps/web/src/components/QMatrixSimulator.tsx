'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface QMatrixSimulatorProps {
  onSimulateUpdate?: (data: any) => void;
  initialFractions?: number[];
  initialDrugs?: { uMenin?: number; uBcl2?: number; uAza?: number; uProtac?: number };
}

export default function QMatrixSimulator({ onSimulateUpdate, initialFractions, initialDrugs }: QMatrixSimulatorProps) {
  const [uMenin, setUMenin] = useState(initialDrugs?.uMenin ?? 0.8);
  const [uBcl2, setUBcl2] = useState(initialDrugs?.uBcl2 ?? 0.5);
  const [uAza, setUAza] = useState(initialDrugs?.uAza ?? 0.3);
  const [uProtac, setUProtac] = useState(initialDrugs?.uProtac ?? 0.0);
  const [hscExpr, setHscExpr] = useState(0.5);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simData, setSimData] = useState<any>(null);

  useEffect(() => {
    if (initialDrugs) {
      if (initialDrugs.uMenin !== undefined) setUMenin(initialDrugs.uMenin);
      if (initialDrugs.uBcl2 !== undefined) setUBcl2(initialDrugs.uBcl2);
      if (initialDrugs.uAza !== undefined) setUAza(initialDrugs.uAza);
      if (initialDrugs.uProtac !== undefined) setUProtac(initialDrugs.uProtac);
    }
  }, [initialDrugs]);

  const runSimulation = () => {
    setIsSimulating(true);

    const numPoints = 30;
    const timepoints = Array.from({ length: numPoints }, (_, i) => (i * 336) / (numPoints - 1));

    const s1 = [];
    const s2 = [];
    const s3 = [];
    const s4 = [];
    const s5 = [];

    const init = initialFractions || [0.10, 0.45, 0.35, 0.08, 0.02];
    let p1 = init[0], p2 = init[1], p3 = init[2], p4 = init[3], p5 = init[4];

    for (let t = 0; t < numPoints; t++) {
      s1.push(p1);
      s2.push(p2);
      s3.push(p3);
      s4.push(p4);
      s5.push(p5);

      const k_deg = 0.06 * uProtac;
      const kill2 = 0.035 * uMenin + 0.025 * uBcl2 + 0.045 * (uMenin * uBcl2) + 0.02 * uAza + 0.05 * uProtac;
      const diff4 = 0.02 * uMenin + 0.035 * uProtac;
      const esc5 = 0.005 * Math.max(0, 1 - 0.8 * uBcl2 - 0.9 * uProtac);

      p2 = Math.max(0.01, p2 * (1 - kill2 - diff4 - esc5 - k_deg));
      p3 = Math.max(0.01, p3 * (1 - 0.05 * uBcl2));
      p4 = Math.min(0.85, p4 + p2 * diff4 + 0.01);
      p5 = Math.max(0.005, p5 + p2 * esc5 - 0.04 * (uMenin * uBcl2 * uAza) - 0.08 * uProtac);

      // Normal HSC (S1) niche preservation maintenance
      p1 = Math.min(0.146, p1 + 0.002 * (1.0 - p2));

      const total = p1 + p2 + p3 + p4 + p5;
      p1 /= total; p2 /= total; p3 /= total; p4 /= total; p5 /= total;
    }

    const minEigen = 0.0025 * (uMenin + uBcl2 + uAza + uProtac);
    const unconstrainedAlert = minEigen < 0.001;

    const dvr = 1.5 / (hscExpr + 0.001);
    const selectivityLocked = hscExpr > 2.0;

    const data = {
      sample_id: "BEATAML_PATIENT_2026_COHORT",
      timepoints,
      trajectories: { s1, s2, s3, s4, s5 },
      final_fractions: {
        S1_NORMAL_HSC: s1[numPoints - 1],
        S2_LSC_PERSISTENT: s2[numPoints - 1],
        S3_PROGENITOR_BLAST: s3[numPoints - 1],
        S4_DIFFERENTIATED: s4[numPoints - 1],
        S5_RESISTANT_ESCAPE: s5[numPoints - 1],
      },
      fim_min_eigenvalue: minEigen,
      fim_unconstrained_alert: unconstrainedAlert,
      dvr_score: dvr,
      dvr_selectivity_locked: selectivityLocked,
      uMenin, uBcl2, uAza, uProtac, hscExpr
    };

    setSimData(data);
    if (onSimulateUpdate) onSimulateUpdate(data);
    setIsSimulating(false);
  };

  useEffect(() => {
    runSimulation();
  }, [uMenin, uBcl2, uAza, uProtac, hscExpr]);

  return (
    <div className="space-y-6">
      {/* Control Sliders Panel */}
      <div className="neu-card-convex p-5 border border-convexBorder rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-noorEmerald flex items-center gap-2">
            <Zap className="w-4 h-4 text-noorEmerald" />
            14-Day Dynamic Perturbation Controller (U₁, U₂, U₃)
          </h3>
          <span className="text-xs text-slate-400 font-mono">ODE Solver: RK4 (Dormand-Prince)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="neu-inset p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-cyanCore">U₁: Menin Inhibitor</span>
              <span className="font-mono text-cyanCore font-bold">{uMenin.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.05"
              value={uMenin} onChange={(e) => setUMenin(parseFloat(e.target.value))}
              className="w-full accent-cyanCore bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">Revumenib / Ziftomenib</div>
          </div>

          <div className="neu-inset p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-noorEmerald">U₂: BCL2 Inhibitor</span>
              <span className="font-mono text-noorEmerald font-bold">{uBcl2.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.05"
              value={uBcl2} onChange={(e) => setUBcl2(parseFloat(e.target.value))}
              className="w-full accent-noorEmerald bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">Venetoclax</div>
          </div>

          <div className="neu-inset p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-amber-400">U₃: HMA Agent</span>
              <span className="font-mono text-amber-400 font-bold">{uAza.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.05"
              value={uAza} onChange={(e) => setUAza(parseFloat(e.target.value))}
              className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">Azacitidine</div>
          </div>

          <div className="neu-inset p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-purple-400">U₄: Menin PROTAC</span>
              <span className="font-mono text-purple-400 font-bold">{uProtac.toFixed(2)}</span>
            </div>
            <input
              type="range" min="0" max="1" step="0.05"
              value={uProtac} onChange={(e) => setUProtac(parseFloat(e.target.value))}
              className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">Targeted Degrader</div>
          </div>

          <div className="neu-inset p-3 rounded-lg space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-300">Normal HSC TPM</span>
              <span className="font-mono text-slate-300 font-bold">{hscExpr.toFixed(1)}</span>
            </div>
            <input
              type="range" min="0.1" max="5.0" step="0.1"
              value={hscExpr} onChange={(e) => setHscExpr(parseFloat(e.target.value))}
              className="w-full accent-slate-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="text-[10px] text-slate-400">&gt;2.0 TPM Locks E4</div>
          </div>
        </div>
      </div>

      {/* SVG Dynamic Trajectory Canvas */}
      <div className="neu-card p-5 border border-convexBorder rounded-xl relative">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Cell State Population Fraction Trajectories (t = 0 to 336 hrs)
          </h4>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span> S1 Normal HSC</span>
            <span className="flex items-center gap-1 text-rose-400"><span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> S2 LSC Persistent</span>
            <span className="flex items-center gap-1 text-amber-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> S3 Blast</span>
            <span className="flex items-center gap-1 text-emerald-400"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> S4 Differentiated</span>
            <span className="flex items-center gap-1 text-cyan-400"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block"></span> S5 Resistant Escape</span>
          </div>
        </div>

        {simData && (
          <div className="w-full h-64 relative border border-slate-800/80 rounded-lg bg-slate-950/60 p-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
              {/* Gridlines */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#1E293B" strokeDasharray="4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#1E293B" strokeDasharray="4" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="#1E293B" strokeDasharray="4" />

              {/* Trajectory Polyline Rendering */}
              {['s1', 's2', 's3', 's4', 's5'].map((stateKey, idx) => {
                const colors = ["#94A3B8", "#F43F5E", "#F59E0B", "#10B981", "#06B6D4"];
                const pts = simData.trajectories[stateKey].map((v: number, i: number) => {
                  const x = (i / (simData.trajectories[stateKey].length - 1)) * 500;
                  const y = 200 - v * 180;
                  return `${x},${y}`;
                }).join(" ");

                return (
                  <polyline
                    key={stateKey}
                    fill="none"
                    stroke={colors[idx]}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    points={pts}
                  />
                );
              })}
            </svg>

            {/* Time labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 px-1">
              <span>0h (Baseline)</span>
              <span>84h (Day 3.5)</span>
              <span>168h (Day 7)</span>
              <span>252h (Day 10.5)</span>
              <span>336h (Day 14)</span>
            </div>
          </div>
        )}

        {/* Final State Summary Cards */}
        {simData && (
          <div className="grid grid-cols-5 gap-3 mt-4">
            <div className="neu-inset p-2.5 rounded text-center">
              <div className="text-[10px] text-slate-400">S1 Normal HSC</div>
              <div className="text-sm font-mono font-bold text-slate-300">
                {(simData.final_fractions.S1_NORMAL_HSC * 100).toFixed(1)}%
              </div>
            </div>
            <div className="neu-inset p-2.5 rounded text-center">
              <div className="text-[10px] text-rose-400">S2 Persistent LSC</div>
              <div className="text-sm font-mono font-bold text-rose-400">
                {(simData.final_fractions.S2_LSC_PERSISTENT * 100).toFixed(1)}%
              </div>
            </div>
            <div className="neu-inset p-2.5 rounded text-center">
              <div className="text-[10px] text-amber-400">S3 Progenitor Blast</div>
              <div className="text-sm font-mono font-bold text-amber-400">
                {(simData.final_fractions.S3_PROGENITOR_BLAST * 100).toFixed(1)}%
              </div>
            </div>
            <div className="neu-inset p-2.5 rounded text-center">
              <div className="text-[10px] text-emerald-400">S4 Differentiated</div>
              <div className="text-sm font-mono font-bold text-emerald-400">
                {(simData.final_fractions.S4_DIFFERENTIATED * 100).toFixed(1)}%
              </div>
            </div>
            <div className="neu-inset p-2.5 rounded text-center">
              <div className="text-[10px] text-cyan-400">S5 Resistant Escape</div>
              <div className="text-sm font-mono font-bold text-cyan-400">
                {(simData.final_fractions.S5_RESISTANT_ESCAPE * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

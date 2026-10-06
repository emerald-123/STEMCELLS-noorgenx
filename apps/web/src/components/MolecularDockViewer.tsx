'use client';

import React, { useState } from 'react';
import { Dna, Box, Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function MolecularDockViewer() {
  const [activeModel, setActiveModel] = useState<'ESMFold' | 'AlphaFold3' | 'Evo2'>('ESMFold');
  const [licensingNotice, setLicensingNotice] = useState<string | null>(null);

  const handleSelectModel = (model: 'ESMFold' | 'AlphaFold3' | 'Evo2') => {
    if (model === 'AlphaFold3') {
      setLicensingNotice("COMMERCIAL_LICENSE_BLOCK: AlphaFold 3 weights carry non-commercial restrictions. Automatically fallen back to ESMFold with valid commercial clearance.");
      setActiveModel('ESMFold');
    } else {
      setLicensingNotice(null);
      setActiveModel(model);
    }
  };

  return (
    <div className="neu-card p-5 border border-convexBorder rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-noorEmerald" />
          <h3 className="text-sm font-semibold text-slate-100">
            3D Molecular Docking Viewer — MEN1 M327I :: KMT2A Complex
          </h3>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Selected Adapter:</span>
          <span className="px-2 py-0.5 rounded bg-cyanCore/20 text-cyanCore font-bold border border-cyanCore/40">
            {activeModel} (v1.0)
          </span>
        </div>
      </div>

      {licensingNotice && (
        <div className="neu-inset p-3 border border-amber-500/50 bg-amber-500/10 text-amber-300 rounded-lg text-xs flex items-center gap-2 font-mono">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{licensingNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 3D Visualizer Canvas (Simulated Mol* viewport with rendered alpha helices & ligand dock) */}
        <div className="md:col-span-2 neu-inset p-4 rounded-xl relative h-72 flex flex-col justify-between overflow-hidden bg-slate-950/80">
          <div className="flex justify-between items-center z-10">
            <span className="text-[11px] font-mono text-noorEmerald bg-noorEmerald/10 px-2 py-0.5 rounded border border-noorEmerald/30">
              PDB / AF2-MEN1-M327I-KMT2A
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Interface pTM: 0.88 | RMSD: 1.42 Å
            </span>
          </div>

          {/* 3D Structure Render Graphics */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg className="w-64 h-64 opacity-80" viewBox="0 0 200 200">
              {/* Protein Backbone Helices */}
              <path d="M 30 100 Q 50 40 80 100 T 130 100 T 170 100" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
              <path d="M 40 120 Q 70 160 100 120 T 150 120 T 180 120" fill="none" stroke="#06B6D4" strokeWidth="3" strokeDasharray="6" />

              {/* M327I Mutation Pocket */}
              <circle cx="100" cy="100" r="16" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3" />
              <circle cx="100" cy="100" r="4" fill="#F43F5E" />
              <text x="100" y="76" textAnchor="middle" fill="#F43F5E" fontSize="9" fontWeight="bold">M327I Escape Pocket</text>

              {/* Ziftomenib Ligand Dock */}
              <polygon points="92,95 108,95 100,110" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex justify-between items-center z-10 text-[10px] text-slate-500 font-mono">
            <span>Ligand: Revumenib (SNDX-5613) / Ziftomenib (KO-539)</span>
            <span>Binding ΔG: -6.2 kcal/mol</span>
          </div>
        </div>

        {/* Model Arena Select & License Inspector */}
        <div className="neu-card-convex p-4 rounded-xl space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyanCore" />
            Model Registry Arena
          </h4>

          <div className="space-y-2">
            <button
              onClick={() => handleSelectModel('ESMFold')}
              className={`w-full text-left neu-button p-2.5 rounded-lg border ${
                activeModel === 'ESMFold' ? 'border-noorEmerald bg-slate-800/80' : 'border-convexBorder'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                <span>ESMFold Adapter</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-noorEmerald/20 text-noorEmerald border border-noorEmerald/40">COMMERCIAL_OK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Rapid structural folding & complex alignment</div>
            </button>

            <button
              onClick={() => handleSelectModel('Evo2')}
              className={`w-full text-left neu-button p-2.5 rounded-lg border ${
                activeModel === 'Evo2' ? 'border-cyanCore bg-slate-800/80' : 'border-convexBorder'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                <span>Evo2 Genomic Adapter</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-noorEmerald/20 text-noorEmerald border border-noorEmerald/40">COMMERCIAL_OK</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Sequence likelihood & escape fitness scoring</div>
            </button>

            <button
              onClick={() => handleSelectModel('AlphaFold3')}
              className="w-full text-left neu-button p-2.5 rounded-lg border border-convexBorder opacity-80"
            >
              <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                <span>AlphaFold 3 Adapter</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">NON-COMMERCIAL</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Triggers license block & ESMFold fallback</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

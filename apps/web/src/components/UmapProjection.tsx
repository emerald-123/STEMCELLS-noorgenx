'use client';

import React, { useState } from 'react';
import { Layers, Search, ShieldCheck } from 'lucide-react';

export default function UmapProjection() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  const clusters = [
    { id: 'S1', label: 'S1: Normal HSC', color: 'bg-slate-400', count: 1240, marker: 'CD34+ CD38- Lin-' },
    { id: 'S2', label: 'S2: Persistent LSC', color: 'bg-rose-500', count: 4520, marker: 'HOXA9+ MEIS1+ MEN1_wt' },
    { id: 'S3', label: 'S3: Progenitor Blasts', color: 'bg-amber-500', count: 3890, marker: 'CD34+ CD38+ MPO+' },
    { id: 'S4', label: 'S4: Differentiated Myeloid', color: 'bg-emerald-500', count: 1100, marker: 'CD11b+ CD14+ Mature' },
    { id: 'S5', label: 'S5: MEN1 M327I Escape Clone', color: 'bg-cyan-400', count: 850, marker: 'MEN1_M327I FLT3_ITD' },
  ];

  return (
    <div className="neu-card p-5 border border-convexBorder rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-cyanCore flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyanCore" />
          Single-Cell UMAP Trajectory Projection (CELLxGENE Beat AML Alignment)
        </h3>
        <span className="text-xs text-slate-400 font-mono">11,600 Single Cells</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Canvas UMAP plot */}
        <div className="md:col-span-2 neu-inset p-4 rounded-xl relative h-72 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 250">
            {/* Cluster S1 (Normal HSC) - top left */}
            <g opacity={selectedCluster && selectedCluster !== 'S1' ? 0.2 : 1}>
              <circle cx="80" cy="70" r="24" fill="#94A3B8" fillOpacity="0.25" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="75" cy="65" r="3" fill="#94A3B8" />
              <circle cx="85" cy="72" r="3" fill="#94A3B8" />
              <circle cx="82" cy="78" r="3" fill="#94A3B8" />
              <text x="80" y="40" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="bold">S1 Normal HSC</text>
            </g>

            {/* Cluster S2 (LSC Persistent) - center */}
            <g opacity={selectedCluster && selectedCluster !== 'S2' ? 0.2 : 1}>
              <circle cx="180" cy="120" r="38" fill="#F43F5E" fillOpacity="0.25" stroke="#F43F5E" strokeWidth="1.5" />
              <circle cx="175" cy="115" r="4" fill="#F43F5E" />
              <circle cx="190" cy="125" r="4" fill="#F43F5E" />
              <circle cx="165" cy="130" r="4" fill="#F43F5E" />
              <circle cx="185" cy="105" r="4" fill="#F43F5E" />
              <text x="180" y="72" textAnchor="middle" fill="#F43F5E" fontSize="10" fontWeight="bold">S2 Persistent LSC</text>
            </g>

            {/* Cluster S3 (Progenitor Blasts) - top right */}
            <g opacity={selectedCluster && selectedCluster !== 'S3' ? 0.2 : 1}>
              <circle cx="280" cy="80" r="32" fill="#F59E0B" fillOpacity="0.25" stroke="#F59E0B" strokeWidth="1.5" />
              <circle cx="275" cy="75" r="3.5" fill="#F59E0B" />
              <circle cx="285" cy="88" r="3.5" fill="#F59E0B" />
              <circle cx="292" cy="72" r="3.5" fill="#F59E0B" />
              <text x="280" y="40" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="bold">S3 Blasts</text>
            </g>

            {/* Cluster S4 (Differentiated) - bottom left */}
            <g opacity={selectedCluster && selectedCluster !== 'S4' ? 0.2 : 1}>
              <circle cx="120" cy="190" r="28" fill="#10B981" fillOpacity="0.25" stroke="#10B981" strokeWidth="1.5" />
              <circle cx="115" cy="185" r="3" fill="#10B981" />
              <circle cx="125" cy="195" r="3" fill="#10B981" />
              <circle cx="110" cy="198" r="3" fill="#10B981" />
              <text x="120" y="230" textAnchor="middle" fill="#10B981" fontSize="10" fontWeight="bold">S4 Differentiated</text>
            </g>

            {/* Cluster S5 (MEN1 M327I Escape Clone) - bottom right */}
            <g opacity={selectedCluster && selectedCluster !== 'S5' ? 0.2 : 1}>
              <circle cx="310" cy="180" r="26" fill="#06B6D4" fillOpacity="0.3" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3" />
              <circle cx="305" cy="175" r="4" fill="#06B6D4" />
              <circle cx="315" cy="185" r="4" fill="#06B6D4" />
              <circle cx="320" cy="172" r="4" fill="#06B6D4" />
              <text x="310" y="218" textAnchor="middle" fill="#06B6D4" fontSize="10" fontWeight="bold">S5 MEN1 M327I Escape</text>
            </g>

            {/* Differentiation & Escape arrows */}
            <path d="M 180 160 L 130 180" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3" markerEnd="url(#arrow)" />
            <path d="M 218 120 L 250 90" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3" />
            <path d="M 218 135 L 285 170" stroke="#06B6D4" strokeWidth="2" />
          </svg>

          <div className="absolute bottom-2 left-2 text-[10px] text-slate-500 font-mono">
            UMAP_1 vs UMAP_2 (AnnData h5ad)
          </div>
        </div>

        {/* Cluster Inspector */}
        <div className="neu-card-convex p-4 rounded-xl space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Cell Cluster Annotations
          </h4>
          <div className="space-y-2">
            {clusters.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCluster(selectedCluster === c.id ? null : c.id)}
                className={`neu-button p-2.5 rounded-lg flex items-center justify-between cursor-pointer border ${
                  selectedCluster === c.id ? 'border-cyanCore bg-slate-800/80' : 'border-convexBorder'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${c.color}`}></span>
                  <div>
                    <div className="text-xs font-medium text-slate-200">{c.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.marker}</div>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

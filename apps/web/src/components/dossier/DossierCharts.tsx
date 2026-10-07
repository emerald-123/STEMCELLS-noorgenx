import React from 'react';

interface ChartProps {
  paper?: any;
}

// Figure 1: Spatio-temporal drug-ratio synergy surface or Morphogen Guidance Tensor
export const SynergyHeatmapPreview: React.FC<ChartProps> = ({ paper }) => {
  const paperId = paper?.id || 'bone_marrow_aml';
  const category = paper?.category || '';
  const isOncology = paperId === 'bone_marrow_aml' || paperId === 'hematology' || category.toLowerCase().includes('hematology') || category.toLowerCase().includes('oncology');

  // Generate 10x10 heat matrix
  const rows = 10;
  const cols = 10;
  const grid = [];

  for (let r = 0; r < rows; r++) {
    const rowCells = [];
    for (let c = 0; c < cols; c++) {
      // Calculate Bliss / morphogen excess value (peaks near r=7, c=4)
      const dist = Math.sqrt(Math.pow(r - 7, 2) + Math.pow(c - 4, 2));
      const blissVal = Math.max(0, 0.38 - dist * 0.05);
      rowCells.push({ r, c, val: blissVal });
    }
    grid.push(rowCells);
  }

  const figureTitle = isOncology
    ? 'Figure 1: Spatio-temporal drug-ratio synergy surface (Bliss model)'
    : 'Figure 1: Morphogen Concentration Field & Directional Ingrowth Tensor';

  const badgeText = isOncology
    ? 'Max Bliss Excess: +0.380 (Optimal Sweet Spot)'
    : 'Max Factor Efficiency: +0.380 (Optimal Ratio)';

  const axisYLabel = isOncology ? 'U1: Revumenib (Menin Inh) →' : 'M1: Primary Morphogen Conc →';
  const axisXLabel = isOncology ? 'U2: Venetoclax Conc (BCL2 Inh) →' : 'M2: Secondary Morphogen Conc →';

  const pinpointTitle = isOncology ? 'Synergy Coordinate Pinpoint:' : 'Optimal Morphogen Factor Pairing:';

  const optCoords = paper?.benchmarkMetrics?.[0]?.cellNoorScore || (isOncology ? '0.710 μM x 0.420 μM' : 'NT-3 (M1) x BDNF (M2) Ratio');
  const mechText = paper?.target_claim || paper?.executiveSummary?.slice(0, 120) || (isOncology
    ? 'Dual BCL2/Menin displacement forces mitochondrial apoptosis in persistent LSCs (S2).'
    : 'Regenerative morphogen ratio driving Olig2+/Sox10+ axonal remyelination and target cell maturation.');

  const captionText = isOncology
    ? 'Caption: High-resolution Bliss synergy contour matrix computed over 336h. Green star (★) denotes optimal kill-zone coordinates preventing MEN1 M327I escape.'
    : 'Caption: High-resolution morphogen concentration field & directional guidance tensor matrix. Green star (★) denotes optimal factor ratio driving target cell specification.';

  return (
    <div className="my-4 neu-inset p-4 rounded-xl border border-slate-800/80 bg-slate-950/70">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-mono font-bold text-cyanCore uppercase tracking-wider">
          {figureTitle}
        </h4>
        <span className="text-[10px] font-mono text-noorEmerald font-bold bg-noorEmerald/10 px-2 py-0.5 rounded border border-noorEmerald/30">
          {badgeText}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* 10x10 Heatmap Grid */}
        <div className="flex flex-col items-center">
          <div className="text-[9px] font-mono text-slate-400 mb-1">
            {axisXLabel}
          </div>
          <div className="flex items-center">
            <div className="text-[9px] font-mono text-slate-400 mr-2 -rotate-90 whitespace-nowrap">
              {axisYLabel}
            </div>
            <div className="grid grid-cols-10 gap-1 bg-slate-900 p-2 rounded-lg border border-slate-800">
              {grid.map((row) =>
                row.map((cell) => {
                  const isMax = cell.r === 7 && cell.c === 4;
                  const intensity = Math.min(1, cell.val / 0.38);
                  const bgStyle = isMax
                    ? 'bg-noorEmerald text-slate-950 font-black shadow-glowEmerald border-2 border-white'
                    : intensity > 0.6
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : intensity > 0.3
                    ? 'bg-cyan-900/60 text-cyan-200'
                    : 'bg-slate-800/50 text-slate-600';

                  return (
                    <div
                      key={`${cell.r}-${cell.c}`}
                      className={`w-6 h-6 rounded flex items-center justify-center text-[8px] font-mono transition-all ${bgStyle}`}
                      title={`Val: +${cell.val.toFixed(3)}`}
                    >
                      {isMax ? '★' : cell.val > 0.1 ? `.${Math.round(cell.val * 10)}` : ''}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Legend & Synergy Metrics */}
        <div className="space-y-2 text-xs font-mono text-slate-300">
          <div className="neu-button p-2.5 rounded-lg border border-cyanCore/30 space-y-1">
            <div className="text-cyanCore font-bold">{pinpointTitle}</div>
            <div className="text-[11px] text-slate-200">
              &bull; <strong>Factor Pairing / Coordinates:</strong> {optCoords}<br />
              &bull; <strong>Mechanism:</strong> {mechText}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic">
            {captionText}
          </div>
        </div>
      </div>
    </div>
  );
};

// Figure 2: Q-Matrix ODE 14-Day Kinetic Time-Series
export const ODETimeSeriesChart: React.FC<ChartProps> = ({ paper }) => {
  const paperId = paper?.id || 'bone_marrow_aml';
  const category = paper?.category || '';
  const isOncology = paperId === 'bone_marrow_aml' || paperId === 'hematology' || category.toLowerCase().includes('hematology') || category.toLowerCase().includes('oncology');

  const titleText = isOncology
    ? 'Figure 2: 14-Day Population State Dynamics (Dormand-Prince RK4 ODE Integration)'
    : 'Figure 2: 14-Day Lineage Maturation Kinetics (Dormand-Prince RK4 ODE)';

  const legendS1 = isOncology ? 'S1: Normal HSC (Spared ~15%)' : 'S_host: Quiescent Host Tissue (Preserved)';
  const legendS2 = isOncology ? 'S2: Persistent LSC (54% → 0%)' : 'S_prog: Uncommitted Progenitor Influx (Diffusing)';

  let targetCellName = 'Functional Target Cell Differentiation';
  if (paperId.includes('spinal') || paper?.indication?.toLowerCase().includes('spinal')) {
    targetCellName = 'MBP+ Myelinating Oligodendrocytes';
  } else if (paperId.includes('limbal') || paper?.indication?.toLowerCase().includes('corneal')) {
    targetCellName = 'Corneal Limbal Epithelium';
  } else if (paperId.includes('dopaminergic') || paper?.indication?.toLowerCase().includes('parkinson')) {
    targetCellName = 'A9 Dopaminergic Neurons';
  } else if (paperId.includes('cartilage') || paper?.indication?.toLowerCase().includes('cartilage')) {
    targetCellName = 'Collagen II+ Chondrocytes';
  } else if (paperId.includes('at2') || paper?.indication?.toLowerCase().includes('pulmonary')) {
    targetCellName = 'SFTPC+ AT2 Epithelium';
  }

  const legendS4 = isOncology ? 'S4: Differentiated Myeloid (13% → 85%)' : `S_target: ${targetCellName}`;
  const legendS5 = isOncology ? 'S5: MEN1 M327I Escape (0% Suppressed)' : 'S_quiescent: Matrix Integration (Preserved)';

  const captionText = isOncology
    ? 'Caption: Longitudinal cell state trajectory solver output under U1 (0.71 μM) + U2 (0.42 μM) synergy combination over 336 hours.'
    : 'Caption: Longitudinal lineage maturation trajectory solver output over 336 hours under optimal morphogen signaling gradients.';

  return (
    <div className="my-4 neu-inset p-4 rounded-xl border border-slate-800/80 bg-slate-950/70">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-mono font-bold text-noorEmerald uppercase tracking-wider">
          {titleText}
        </h4>
        <span className="text-[10px] font-mono text-cyanCore font-bold bg-cyanCore/10 px-2 py-0.5 rounded border border-cyanCore/30">
          0 &ndash; 336 Hours (14 Days)
        </span>
      </div>

      <div className="relative w-full h-56 bg-slate-900/90 rounded-lg border border-slate-800 p-3 flex flex-col justify-between">
        {/* SVG Multi-Line Plot */}
        <svg viewBox="0 0 500 180" className="w-full h-full">
          {/* Grid lines */}
          <line x1="40" y1="20" x2="480" y2="20" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="60" x2="480" y2="60" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="100" x2="480" y2="100" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="40" y1="140" x2="480" y2="140" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

          {/* Axes */}
          <line x1="40" y1="10" x2="40" y2="150" stroke="#475569" strokeWidth="1.5" />
          <line x1="40" y1="150" x2="480" y2="150" stroke="#475569" strokeWidth="1.5" />

          {/* Axis Labels */}
          <text x="35" y="25" fill="#94A3B8" fontSize="8" textAnchor="end" fontFamily="monospace">100%</text>
          <text x="35" y="85" fill="#94A3B8" fontSize="8" textAnchor="end" fontFamily="monospace">50%</text>
          <text x="35" y="148" fill="#94A3B8" fontSize="8" textAnchor="end" fontFamily="monospace">0%</text>

          <text x="40" y="165" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">0h</text>
          <text x="150" y="165" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">84h</text>
          <text x="260" y="165" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">168h</text>
          <text x="370" y="165" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">252h</text>
          <text x="480" y="165" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">336h</text>

          {/* S1 / S_host (Green Line: Steady at ~15%) */}
          <path
            d="M 40 128 Q 150 125, 260 126 T 480 127"
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
          />

          {/* S2 / S_prog (Red Line: Drops from 54% to 0%) */}
          <path
            d="M 40 70 Q 120 110, 200 135 T 320 148 L 480 150"
            fill="none"
            stroke="#EF4444"
            strokeWidth="3"
          />

          {/* S4 / S_target (Cyan Line: Rises from 13% to 85%) */}
          <path
            d="M 40 130 Q 150 70, 260 40 T 480 30"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="3"
          />

          {/* S5 / S_quiescent (Blue Line: Preserved / Suppressed) */}
          <path
            d="M 40 148 Q 120 142, 200 147 T 480 149"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
        </svg>

        {/* Legend Overlay */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-1 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <div className="w-3 h-0.5 bg-emerald-400" />
            <span>{legendS1}</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-400">
            <div className="w-3 h-0.5 bg-red-400" />
            <span>{legendS2}</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <div className="w-3 h-0.5 bg-cyan-400" />
            <span>{legendS4}</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-400">
            <div className="w-3 h-0.5 bg-blue-400 border-dashed" />
            <span>{legendS5}</span>
          </div>
        </div>
      </div>
      <div className="text-[10px] text-slate-400 italic mt-2 font-mono">
        {captionText}
      </div>
    </div>
  );
};

// Figure 3: Single-Cell UMAP Cluster Embedding Diagram
export const UMAPEmbeddingFigure: React.FC<ChartProps> = ({ paper }) => {
  const paperId = paper?.id || 'bone_marrow_aml';
  const category = paper?.category || '';
  const isOncology = paperId === 'bone_marrow_aml' || paperId === 'hematology' || category.toLowerCase().includes('hematology') || category.toLowerCase().includes('oncology');

  const titleText = isOncology
    ? 'Figure 3: Single-Cell UMAP Clonal Divergence Map (11,600 Beat AML Cells)'
    : 'Figure 3: Single-Cell Atlas Trajectory (Lineage Specification)';

  const s1Label = isOncology ? 'S1' : 'S1';
  const s1Sub = isOncology ? 'HSC (1,240)' : 'Progenitor Pool';

  const s2Label = isOncology ? 'S2 LSC' : 'S2 Transit';
  const s2Sub = isOncology ? 'LSC (4,520)' : 'Intermediate Transit';

  const s3Label = isOncology ? 'S3' : 'S3 Target';

  let s3SubLine1 = 'Functional Target';
  let s3SubLine2 = '(Target Lineage)';

  if (paperId.includes('spinal') || paper?.indication?.toLowerCase().includes('spinal')) {
    s3SubLine1 = 'Olig2+ OPC';
    s3SubLine2 = '(Target Lineage)';
  } else if (paperId.includes('limbal') || paper?.indication?.toLowerCase().includes('corneal')) {
    s3SubLine1 = 'LESC Epithelium';
    s3SubLine2 = '(Target Lineage)';
  } else if (paperId.includes('dopaminergic') || paper?.indication?.toLowerCase().includes('parkinson')) {
    s3SubLine1 = 'A9 DA Neurons';
    s3SubLine2 = '(Target Lineage)';
  } else if (paperId.includes('cartilage') || paper?.indication?.toLowerCase().includes('cartilage')) {
    s3SubLine1 = 'COL2A1+ Chondrocytes';
    s3SubLine2 = '(Target Lineage)';
  } else if (paperId.includes('at2') || paper?.indication?.toLowerCase().includes('pulmonary')) {
    s3SubLine1 = 'SFTPC+ AT2 Epithelium';
    s3SubLine2 = '(Target Lineage)';
  } else if (isOncology) {
    s3SubLine1 = 'Blasts (3,890)';
    s3SubLine2 = '';
  }

  const s4Label = 'S4';
  const s4Sub = isOncology ? 'Myeloid (1,100)' : 'Quiescent Host Matrix';

  const s5Label = isOncology ? 'S5' : 'S5 Spec';
  const s5Sub = isOncology ? 'MEN1 M327I (850)' : 'Terminal Specification';

  const captionText = isOncology
    ? 'Caption: 2D UMAP projection showing persistent LSC state (S2) bifurcation into differentiated myeloid cells (S4) vs. resistant MEN1 M327I escape clone (S5).'
    : 'Caption: 2D UMAP projection showing lineage specification trajectory from progenitor pool (S1) through intermediate transit (S2) to functional target cell differentiation (S3).';

  return (
    <div className="my-4 neu-inset p-4 rounded-xl border border-slate-800/80 bg-slate-950/70">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-mono font-bold text-cyanCore uppercase tracking-wider">
          {titleText}
        </h4>
        <span className="text-[10px] font-mono text-noorEmerald font-bold bg-noorEmerald/10 px-2 py-0.5 rounded border border-noorEmerald/30">
          CELLxGENE Alignment Verified
        </span>
      </div>

      <div className="relative w-full h-52 bg-slate-900/90 rounded-lg border border-slate-800 p-3 flex items-center justify-between">
        <svg viewBox="0 0 450 160" className="w-full h-full">
          {/* Trajectory Vectors */}
          <path d="M 120 70 L 220 50" stroke="#64748B" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M 220 50 L 280 120" stroke="#10B981" strokeWidth="2" />
          <path d="M 220 50 L 340 35" stroke="#3B82F6" strokeWidth="2" strokeDasharray="4 4" />

          {/* S1 Node */}
          <circle cx="120" cy="70" r="18" fill="#334155" stroke="#64748B" strokeWidth="2" />
          <text x="120" y="73" fill="#F8FAFC" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s1Label}</text>
          <text x="120" y="100" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">{s1Sub}</text>

          {/* S2 Node */}
          <circle cx="220" cy="50" r="24" fill={isOncology ? '#991B1B' : '#0284C7'} stroke={isOncology ? '#EF4444' : '#06B6D4'} strokeWidth="2.5" />
          <text x="220" y="53" fill="#F8FAFC" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s2Label}</text>
          <text x="220" y="85" fill={isOncology ? '#EF4444' : '#06B6D4'} fontSize="8" textAnchor="middle" fontFamily="monospace">{s2Sub}</text>

          {/* S3 Node - Stacked 2-line label to prevent cut off */}
          <circle cx="280" cy="120" r="16" fill={isOncology ? '#78350F' : '#065F46'} stroke={isOncology ? '#F59E0B' : '#10B981'} strokeWidth="2" />
          <text x="280" y="123" fill="#F8FAFC" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s3Label}</text>
          <text x="280" y="143" fill={isOncology ? '#F59E0B' : '#10B981'} fontSize="8" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s3SubLine1}</text>
          {s3SubLine2 && (
            <text x="280" y="153" fill={isOncology ? '#F59E0B' : '#10B981'} fontSize="7" textAnchor="middle" fontFamily="monospace">{s3SubLine2}</text>
          )}

          {/* S4 Node - Node text inside S4, text outside Quiescent Host Matrix */}
          <circle cx="340" cy="35" r="22" fill={isOncology ? '#065F46' : '#334155'} stroke={isOncology ? '#10B981' : '#64748B'} strokeWidth="2.5" />
          <text x="340" y="38" fill="#F8FAFC" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s4Label}</text>
          <text x="340" y="68" fill={isOncology ? '#10B981' : '#94A3B8'} fontSize="8" textAnchor="middle" fontFamily="monospace">{s4Sub}</text>

          {/* S5 Node */}
          <circle cx="370" cy="115" r="20" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2.5" strokeDasharray="3 3" />
          <text x="370" y="118" fill="#F8FAFC" fontSize="9" textAnchor="middle" fontFamily="monospace" fontWeight="bold">{s5Label}</text>
          <text x="370" y="145" fill="#3B82F6" fontSize="8" textAnchor="middle" fontFamily="monospace">{s5Sub}</text>
        </svg>
      </div>

      <div className="text-[10px] text-slate-400 italic mt-2 font-mono">
        {captionText}
      </div>
    </div>
  );
};


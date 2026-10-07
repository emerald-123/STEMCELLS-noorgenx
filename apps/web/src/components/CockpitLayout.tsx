'use client';

import React, { useState } from 'react';
import {
  Database,
  GitBranch,
  Target,
  FlaskConical,
  Cpu,
  Share2,
  Activity,
  ShieldCheck,
  Building2,
  Terminal,
  FileText,
} from 'lucide-react';

import QMatrixSimulator from './QMatrixSimulator';
import UmapProjection from './UmapProjection';
import MolecularDockViewer from './MolecularDockViewer';
import NoorLightPanel from './NoorLightPanel';
import WhitePaperView from './WhitePaperView';
import SynergyHeatmapViewer from './SynergyHeatmapViewer';
import PatientVcfUploader from './PatientVcfUploader';
import MultiscalePDEViewer from './MultiscalePDEViewer';

export default function CockpitLayout() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'umap' | 'dock' | 'paper' | 'synergy' | 'vcf' | 'pde'>('simulator');
  const [activeNav, setActiveNav] = useState<string>('virtual_lab');
  const [simData, setSimData] = useState<any>(null);
  const [twinConfig, setTwinConfig] = useState<any>(null);

  const handleIngestComplete = (simResult: any, config: any) => {
    if (simResult) setSimData(simResult);
    if (config) setTwinConfig(config);
    setActiveTab('simulator');
    setActiveNav('virtual_lab');
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-void overflow-hidden text-slate-100">
      {/* Top Sovereign Bar */}
      <header className="h-14 border-b border-convexBorder bg-slateElevated/90 px-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <img
            src="/brand/noorgenx-official-logo.png"
            alt="NoorGenX Ecosystem Logo"
            className="h-9 w-auto object-contain shrink-0"
          />
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-noorEmerald via-cyanCore to-blue-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-glowEmerald">
            CN
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-slate-100 text-sm font-mono">CELLNOOR</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-noorEmerald/20 text-noorEmerald border border-noorEmerald/40 font-semibold">
                v1.0 AML Flagship
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
              <span>Horizon Commerce LLC (UEI: NY9AHGK2BBZ7)</span>
              <span>•</span>
              <span className="text-cyanCore">NoorGenX Ecosystem</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-1.5 text-noorEmerald">
            <ShieldCheck className="w-4 h-4 text-noorEmerald" />
            <span>Anti-Simulation Gate: ACTIVE</span>
          </div>
          <div className="text-slate-400">
            Target: <span className="text-slate-200 font-semibold">MEN1 / KMT2A Escape</span>
          </div>
        </div>
      </header>

      {/* Main 3-Panel Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Bar */}
        <aside className="w-60 border-r border-convexBorder bg-slateElevated/80 p-3 flex flex-col justify-between shrink-0">
          <div className="space-y-1">
            <div className="px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Cockpit Modules
            </div>

            <button
              onClick={() => setActiveNav('dataset_atlas')}
              className={`w-full neu-button p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-medium ${
                activeNav === 'dataset_atlas' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-300 border-transparent'
              }`}
            >
              <Database className="w-4 h-4 text-noorEmerald" />
              <span>Dataset Atlas</span>
            </button>

            <button
              onClick={() => setActiveNav('state_space')}
              className={`w-full neu-button p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-medium ${
                activeNav === 'state_space' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-300 border-transparent'
              }`}
            >
              <GitBranch className="w-4 h-4 text-cyanCore" />
              <span>State Space (S₁..S₅)</span>
            </button>

            <button
              onClick={() => setActiveNav('target_discovery')}
              className={`w-full neu-button p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-medium ${
                activeNav === 'target_discovery' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-300 border-transparent'
              }`}
            >
              <Target className="w-4 h-4 text-amber-400" />
              <span>Target Discovery</span>
            </button>

            <button
              onClick={() => setActiveNav('virtual_lab')}
              className={`w-full neu-button p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-medium ${
                activeNav === 'virtual_lab' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-300 border-transparent'
              }`}
            >
              <FlaskConical className="w-4 h-4 text-noorEmerald" />
              <span>Virtual Lab (Q-Matrix)</span>
            </button>

            <button
              onClick={() => setActiveNav('model_arena')}
              className={`w-full neu-button p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-medium ${
                activeNav === 'model_arena' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-300 border-transparent'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyanCore" />
              <span>Model Arena</span>
            </button>

            <button
              onClick={() => setActiveNav('evidence_graph')}
              className={`w-full neu-button p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-medium ${
                activeNav === 'evidence_graph' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-300 border-transparent'
              }`}
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Why-Graph (E₁..E₆)</span>
            </button>
            <button
              onClick={() => setActiveNav('white_paper')}
              className={`w-full neu-button p-2.5 rounded-lg flex items-center gap-2.5 text-xs font-medium ${
                activeNav === 'white_paper' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-300 border-transparent'
              }`}
            >
              <FileText className="w-4 h-4 text-cyanCore" />
              <span>White Paper Study</span>
            </button>
          </div>

          <div className="neu-inset p-3 rounded-lg text-[10px] font-mono text-slate-400 space-y-1">
            <div className="text-noorEmerald font-bold">Motto:</div>
            <div>"No cancer left behind. Every patient has a cure."</div>
          </div>
        </aside>

        {/* Center Workspace */}
        <main className="flex-1 p-5 overflow-y-auto space-y-5">
          {/* Workspace Tabs Header */}
          <div className="flex items-center gap-2 border-b border-convexBorder pb-3">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold neu-button ${
                activeTab === 'simulator' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-400 border-convexBorder'
              }`}
            >
              Q-Matrix ODE Simulator
            </button>
            <button
              onClick={() => setActiveTab('umap')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold neu-button ${
                activeTab === 'umap' ? 'text-cyanCore border-cyanCore bg-slate-800/80' : 'text-slate-400 border-convexBorder'
              }`}
            >
              Single-Cell UMAP Atlas
            </button>
            <button
              onClick={() => { setActiveTab('synergy'); setActiveNav('virtual_lab'); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold neu-button ${
                activeTab === 'synergy' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-400 border-convexBorder'
              }`}
            >
              2D Bliss Synergy Surface
            </button>
            <button
              onClick={() => { setActiveTab('vcf'); setActiveNav('virtual_lab'); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold neu-button ${
                activeTab === 'vcf' ? 'text-cyanCore border-cyanCore bg-slate-800/80' : 'text-slate-400 border-convexBorder'
              }`}
            >
              Patient VCF Ingestion
            </button>
            <button
              onClick={() => { setActiveTab('pde'); setActiveNav('virtual_lab'); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold neu-button ${
                activeTab === 'pde' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-400 border-convexBorder'
              }`}
            >
              3D Multiscale PDE Mesh
            </button>
            <button
              onClick={() => { setActiveTab('paper'); setActiveNav('white_paper'); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold neu-button ${
                activeTab === 'paper' || activeNav === 'white_paper' ? 'text-noorEmerald border-noorEmerald bg-slate-800/80' : 'text-slate-400 border-convexBorder'
              }`}
            >
              Technical White Paper
            </button>
          </div>

          {/* Active Tab View */}
          {activeNav === 'white_paper' || activeTab === 'paper' ? (
            <WhitePaperView />
          ) : activeTab === 'synergy' ? (
            <SynergyHeatmapViewer />
          ) : activeTab === 'vcf' ? (
            <PatientVcfUploader onIngestComplete={handleIngestComplete} />
          ) : activeTab === 'pde' ? (
            <MultiscalePDEViewer />
          ) : (
            <>
              {activeTab === 'simulator' && (
                <QMatrixSimulator
                  onSimulateUpdate={(data) => setSimData(data)}
                  initialFractions={twinConfig?.initialFractions}
                  initialDrugs={twinConfig?.initialDrugs}
                />
              )}
              {activeTab === 'umap' && (
                <UmapProjection />
              )}
              {activeTab === 'dock' && (
                <MolecularDockViewer />
              )}
            </>
          )}
        </main>

        {/* Right Insight Panel ("Noor Light") */}
        <NoorLightPanel simData={simData} />
      </div>
    </div>
  );
}

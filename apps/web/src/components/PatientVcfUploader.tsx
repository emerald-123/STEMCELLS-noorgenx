'use client';

import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle, ShieldCheck, UserCheck, Zap } from 'lucide-react';

export default function PatientVcfUploader({ onIngestComplete }: { onIngestComplete?: (data: any, config?: any) => void }) {
  const [patientId, setPatientId] = useState('PATIENT_VCF_2026_091');
  const [npm1, setNpm1] = useState(true);
  const [kmt2a, setKmt2a] = useState(true);
  const [men1Escape, setMen1Escape] = useState(true);
  const [flt3, setFlt3] = useState(true);
  const [isIngesting, setIsIngesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleIngest = async () => {
    setIsIngesting(true);

    const mutations = [];
    if (npm1) mutations.push('NPM1_mut');
    if (kmt2a) mutations.push('KMT2A_r');
    if (men1Escape) mutations.push('MEN1_M327I');
    if (flt3) mutations.push('FLT3_ITD');

    const twinConfig = {
      patientId,
      mutations,
      initialFractions: men1Escape || flt3 ? [0.07, 0.55, 0.13, 0.05, 0.20] : [0.10, 0.48, 0.36, 0.05, 0.01],
      initialDrugs: {
        uMenin: 0.8,
        uBcl2: 0.5,
        uAza: 0.3,
        uProtac: men1Escape ? 0.8 : 0.0
      }
    };

    try {
      const res = await fetch('http://localhost:8080/api/v1/twin/ingest-vcf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: patientId,
          mutations,
          expression_tpm: { HOXA9: 4.2, MEIS1: 3.8, MEN1: 5.1 }
        })
      });

      if (!res.ok) throw new Error('VCF Ingestion failed');
      const data = await res.json();
      setResult(data);
      if (onIngestComplete) onIngestComplete(data.personalized_simulation, twinConfig);
    } catch (err) {
      console.warn("API unavailable, simulating local VCF twin ingestion", err);
      const mockResult = {
        patient_id: patientId,
        risk_stratification: men1Escape ? "VERY_HIGH_RISK_ESCAPE" : "HIGH_RISK_KMT2A",
        detected_escape_clones: mutations,
        recommended_triplet: men1Escape ? "Menin PROTAC (U4) + Venetoclax (U2) + Azacitidine (U3)" : "Revumenib (U1) + Venetoclax (U2) + Azacitidine (U3)"
      };
      setResult(mockResult);
      if (onIngestComplete) onIngestComplete(null, twinConfig);
    } finally {
      setIsIngesting(false);
    }
  };

  return (
    <div className="neu-card p-5 border border-convexBorder rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-cyanCore" />
          <h3 className="text-sm font-semibold text-slate-100">
            Patient VCF & Transcriptomic Digital Twin Ingestion Engine
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyanCore/20 text-cyanCore border border-cyanCore/40 font-bold">
          PERSONALIZED TWIN RUNNER
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VCF Ingestion Form */}
        <div className="neu-card-convex p-4 rounded-xl space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Patient VCF / Variant Callset Ingestion
          </h4>

          <div className="neu-inset p-2.5 rounded-lg space-y-1">
            <label className="text-[11px] text-slate-400 font-mono block">Patient ID / Medical Record Accession:</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full bg-slate-900 border border-convexBorder rounded px-2.5 py-1 text-xs text-slate-100 font-mono focus:border-cyanCore outline-none"
            />
          </div>

          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-mono text-slate-400">Select Detected Somatic Variants (VCF):</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="neu-inset p-2 rounded flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={npm1} onChange={(e) => setNpm1(e.target.checked)} className="accent-noorEmerald" />
                <span>NPM1 W288fs (Exon 12)</span>
              </label>
              <label className="neu-inset p-2 rounded flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={kmt2a} onChange={(e) => setKmt2a(e.target.checked)} className="accent-noorEmerald" />
                <span>KMT2A rearrangement</span>
              </label>
              <label className="neu-inset p-2 rounded flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={men1Escape} onChange={(e) => setMen1Escape(e.target.checked)} className="accent-cyanCore" />
                <span className="text-cyanCore font-bold">MEN1 M327I (Escape)</span>
              </label>
              <label className="neu-inset p-2 rounded flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={flt3} onChange={(e) => setFlt3(e.target.checked)} className="accent-amber-400" />
                <span>FLT3-ITD (Bypass)</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleIngest}
            disabled={isIngesting}
            className="neu-button w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold text-cyanCore border border-cyanCore/40 hover:bg-cyanCore/10"
          >
            <Zap className="w-4 h-4 text-cyanCore" />
            <span>{isIngesting ? 'Instantiating Digital Twin...' : 'Instantiate Patient Twin & Run ODE Simulation'}</span>
          </button>
        </div>

        {/* Ingestion & Stratification Result */}
        <div className="neu-card-convex p-4 rounded-xl space-y-3 flex flex-col justify-between">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Personalized Digital Twin Stratification
          </h4>

          {result ? (
            <div className="space-y-3">
              <div className="neu-inset p-3 rounded-lg text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient ID:</span>
                  <span className="text-slate-200 font-bold">{result.patient_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risk Stratification:</span>
                  <span className="text-rose-400 font-bold">{result.risk_stratification}</span>
                </div>
              </div>

              <div className="neu-inset p-3 rounded-lg space-y-1">
                <div className="text-[11px] font-mono text-noorEmerald font-bold">Recommended Precision Triplet:</div>
                <div className="text-xs text-slate-200 font-medium">{result.recommended_triplet}</div>
              </div>
            </div>
          ) : (
            <div className="neu-inset p-4 rounded-lg text-xs text-slate-400 font-mono text-center my-auto">
              Configure patient mutation profile and click Instantiate to run a personalized 14-day cellular digital twin simulation.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

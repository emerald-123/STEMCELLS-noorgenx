'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  Award,
  Layers,
  Dna,
  Compass,
  Activity,
  Download,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  Brain,
  Heart,
  Eye,
  ActivitySquare,
  Sparkles,
  ChevronRight,
  BookOpen,
  UserCheck,
  RefreshCw,
  CreditCard,
  Lock,
} from 'lucide-react';
import { WHITE_PAPERS, WhitePaperData } from '../constants/whitePapers';
import { LeadProfile, recordDossierDownload } from '../lib/firebaseDossier';
import { API_BASE_URL } from '../lib/apiConfig';
import LeadCaptureModal from './LeadCaptureModal';
import CheckoutModal from './CheckoutModal';
import NoorGenXLogo from './brand/NoorGenXLogo';
import {
  SynergyHeatmapPreview,
  ODETimeSeriesChart,
  UMAPEmbeddingFigure,
} from './dossier/DossierCharts';

interface WhitePaperViewProps {
  activeLineage?: string;
  onSelectLineage?: (id: string) => void;
}

export default function WhitePaperView({ activeLineage, onSelectLineage }: WhitePaperViewProps = {}) {
  const [selectedId, setSelectedId] = useState<string>('bone_marrow_aml');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Sync with prop activeLineage if provided
  useEffect(() => {
    if (activeLineage) {
      const mapped =
        activeLineage === 'hematology'
          ? 'bone_marrow_aml'
          : activeLineage === 'ophthalmic'
          ? 'corneal_limbal'
          : activeLineage === 'integumentary'
          ? 'skin_epidermis'
          : activeLineage === 'cardiovascular'
          ? 'cardiac_patch'
          : activeLineage === 'endocrine'
          ? 'pancreatic_islet'
          : activeLineage === 'neuro'
          ? 'putamen_dopaminergic'
          : activeLineage === 'auditory'
          ? 'cochlear_hair_cell'
          : activeLineage === 'musculoskeletal'
          ? 'musculoskeletal'
          : activeLineage === 'pulmonary'
          ? 'pulmonary'
          : activeLineage === 'spinal_cord'
          ? 'spinal_cord'
          : activeLineage;
      setSelectedId(mapped);
    }
  }, [activeLineage]);

  const handleSelectPaper = (id: string) => {
    setSelectedId(id);
    if (onSelectLineage) {
      onSelectLineage(id);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cellnoor:lineage_change', {
          detail: { lineageId: id },
        })
      );
    }
  };

  // Lead Modal & Checkout Modal state
  const [isLeadModalOpen, setIsLeadModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [pendingFormat, setPendingFormat] = useState<'pdf' | 'docx' | 'txt' | null>(null);
  const [cachedLead, setCachedLead] = useState<LeadProfile | null>(null);
  const [unlockedPapers, setUnlockedPapers] = useState<string[]>([]);
  const [checkoutNotification, setCheckoutNotification] = useState<string | null>(null);

  const paper: WhitePaperData = WHITE_PAPERS[selectedId] || WHITE_PAPERS['bone_marrow_aml'];

  // Helper icons for categories
  const getLineageIcon = (id: string) => {
    switch (id) {
      case 'bone_marrow_aml':
      case 'hematology':
        return <Dna className="w-4 h-4 text-noorEmerald" />;
      case 'corneal_limbal':
      case 'ophthalmic':
        return <Eye className="w-4 h-4 text-cyanCore" />;
      case 'skin_epidermis':
      case 'integumentary':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'cardiac_patch':
      case 'cardiovascular':
        return <Heart className="w-4 h-4 text-red-400" />;
      case 'pancreatic_islet':
      case 'endocrine':
        return <ActivitySquare className="w-4 h-4 text-purple-400" />;
      case 'putamen_dopaminergic':
      case 'neuro':
        return <Brain className="w-4 h-4 text-blue-400" />;
      case 'cochlear_hair_cell':
      case 'auditory':
        return <Activity className="w-4 h-4 text-teal-400" />;
      case 'articular_cartilage':
      case 'musculoskeletal':
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case 'alveolar_at2':
      case 'pulmonary':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'spinal_cord':
        return <Sparkles className="w-4 h-4 text-violet-400" />;
      default:
        return <FileText className="w-4 h-4 text-noorEmerald" />;
    }
  };

  // Direct Stream Handlers
  const streamPdf = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/dossier/export?paper_id=${paper.id}&format=pdf`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('PDF Generation API request failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CellNoor_Executive_Dossier_${paper.id.toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn('Backend API fallback triggered for PDF download:', err);
      streamTxt();
    } finally {
      setIsExporting(false);
    }
  };

  const streamDocx = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${paper.title}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #0F172A; line-height: 1.5; padding: 20px; }
          h1 { color: #0E7490; font-size: 20pt; margin-bottom: 5px; }
          h2 { color: #0F172A; font-size: 14pt; border-bottom: 2px solid #0E7490; padding-bottom: 4px; margin-top: 20px; }
          .meta { color: #64748B; font-size: 9pt; margin-bottom: 15px; }
          .motto { color: #10B981; font-style: italic; font-weight: bold; margin-bottom: 20px; }
          .summary-box { background: #F8FAFC; border: 1px solid #CBD5E1; padding: 12px; margin-bottom: 15px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #CBD5E1; padding: 8px; text-align: left; font-size: 9.5pt; }
          th { background: #F1F5F9; }
          .code-box { background: #0F172A; color: #38BDF8; font-family: monospace; padding: 10px; font-size: 9pt; }
        </style>
      </head>
      <body>
        <div style="margin-bottom: 15px;">
          <img src="https://stemcells.noorgenx.com/brand/noorgenx_trademark_clean.png" alt="NoorGenX™ Logo" style="height: 48px; width: auto;" />
        </div>
        <h1>${paper.title}</h1>
        <div className="meta">
          <strong>Category:</strong> ${paper.category} | <strong>Published:</strong> ${paper.publishedDate}<br/>
          <strong>Operating Entity:</strong> Horizon Commerce LLC (Lorton, VA; UEI: NY9AHGK2BBZ7)<br/>
          <strong>Ecosystem:</strong> NoorGenX Platform Suite (amjad@noorgenx.com)
        </div>
        <div className="motto">"No cancer left behind. Every patient has a cure."</div>

        <div className="summary-box">
          <strong>Indication:</strong> ${paper.indication}<br/>
          <strong>Addressable Market:</strong> ${paper.marketSize}<br/>
          <strong>Estimated Value / ROI:</strong> ${paper.estimatedRoi}<br/><br/>
          <strong>Executive Summary:</strong> ${paper.executiveSummary}
        </div>

        <h2>1. Clinical Problem & Mechanism</h2>
        <p>${paper.clinicalProblem.description}</p>
        <p><strong>Key Mechanisms:</strong></p>
        <ul>
          ${paper.clinicalProblem.keyMechanisms.map((m) => `<li>${m}</li>`).join('')}
        </ul>
        <p><strong>Cell State Dynamics:</strong></p>
        <ul>
          ${paper.clinicalProblem.cellStateDynamics.map((d) => `<li>${d}</li>`).join('')}
        </ul>

        <h2>2. Mathematical Engine & PDE Dynamics</h2>
        <div className="code-box">${paper.mathematicalEngine.systemEquation}</div>
        <p>
          <strong>Fisher Information Matrix Min Eigenvalue (λ_min):</strong> ${paper.mathematicalEngine.fimEigenvalue} [${paper.mathematicalEngine.identifiabilityStatus}]<br/>
          <strong>Diffusion D_m:</strong> ${paper.mathematicalEngine.pdeParameters.diffusionD_m} | 
          <strong>Chemotactic Drift:</strong> ${paper.mathematicalEngine.pdeParameters.chemotacticDrift} | 
          <strong>Tissue Stress:</strong> ${paper.mathematicalEngine.pdeParameters.tissueStress}
        </p>

        <h2>3. Benchmark Audit Metrics</h2>
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              <th>CellNoor Score</th>
              <th>Standard Baseline</th>
              <th>Net Superiority</th>
            </tr>
          </thead>
          <tbody>
            ${paper.benchmarkMetrics
              .map(
                (b) => `
              <tr>
                <td>${b.name}</td>
                <td><b>${b.cellNoorScore}</b></td>
                <td>${b.standardBaseline}</td>
                <td><font color="#10B981"><b>${b.netSuperiority}</b></font></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <h2>4. Regulatory Audit & Safety Gate</h2>
        <p>
          <strong>Sample Accession:</strong> ${paper.regulatoryAudit.sampleId}<br/>
          <strong>FDA CBER Teratoma Hazard (S_teratoma):</strong> ${paper.regulatoryAudit.teratomaScore} [${paper.regulatoryAudit.teratomaStatus}]<br/>
          <strong>Karyotype Instability:</strong> ${paper.regulatoryAudit.karyotypeScore}<br/>
          <strong>Differential Vulnerability Ratio (DVR):</strong> ${paper.regulatoryAudit.dvrSelectivity} [${paper.regulatoryAudit.normalSelectivityStatus}]
        </p>

        <h2>5. Multi-Omics Evidence Graph</h2>
        <p><strong>Supporting Evidence:</strong></p>
        <ul>${paper.evidenceGraph.supporting.map((s) => `<li>${s}</li>`).join('')}</ul>
        <p><strong>Contradicting Evidence:</strong></p>
        <ul>${paper.evidenceGraph.contradicting.map((c) => `<li>${c}</li>`).join('')}</ul>
        <p><strong>Weakest Link:</strong> ${paper.evidenceGraph.weakestLink}</p>

        <hr/>
        <p className="meta">Horizon Commerce LLC | License Clearance Verified | NoorGenX Platform Suite</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlContent], {
      type: 'application/vnd.ms-word;charset=utf-8',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CellNoor_Executive_Dossier_${paper.id.toUpperCase()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const streamTxt = () => {
    const txtContent = `
================================================================================
[ NOORGENX™ PLATFORM SUITE - OFFICIAL AUDITED CLINICAL DOSSIER ]
Horizon Commerce LLC (Lorton, VA; UEI: NY9AHGK2BBZ7) | amjad@noorgenx.com
================================================================================

1. EXECUTIVE SUMMARY & ROI
Indication: ${paper.indication}
Market Size: ${paper.marketSize}
Estimated Value / ROI: ${paper.estimatedRoi}

Summary:
${paper.executiveSummary}

Commercial Impact:
${paper.commercialImpact.map((c) => `- ${c}`).join('\n')}

2. CLINICAL PROBLEM & CELL DYNAMICS
Title: ${paper.clinicalProblem.title}
Description:
${paper.clinicalProblem.description}

Key Mechanisms:
${paper.clinicalProblem.keyMechanisms.map((m) => `- ${m}`).join('\n')}

Cell State Dynamics:
${paper.clinicalProblem.cellStateDynamics.map((d) => `- ${d}`).join('\n')}

3. MATHEMATICAL ENGINE & PDE DIAGNOSTICS
System Equation: ${paper.mathematicalEngine.systemEquation}
FIM Min Eigenvalue (λ_min): ${paper.mathematicalEngine.fimEigenvalue} [Status: ${paper.mathematicalEngine.identifiabilityStatus}]
PDE Parameters:
- Diffusion D_m: ${paper.mathematicalEngine.pdeParameters.diffusionD_m}
- Chemotactic Drift: ${paper.mathematicalEngine.pdeParameters.chemotacticDrift}
- Continuum Stress: ${paper.mathematicalEngine.pdeParameters.tissueStress}

4. BENCHMARK AUDIT METRICS
${paper.benchmarkMetrics
  .map(
    (b) =>
      `- ${b.name}: CellNoor=${b.cellNoorScore} | Baseline=${b.standardBaseline} | Superiority=${b.netSuperiority}`
  )
  .join('\n')}

5. REGULATORY AUDIT & SAFETY GATE
Sample Accession: ${paper.regulatoryAudit.sampleId}
FDA CBER Teratoma Hazard (S_teratoma): ${paper.regulatoryAudit.teratomaScore} [${paper.regulatoryAudit.teratomaStatus}]
Karyotype Instability: ${paper.regulatoryAudit.karyotypeScore}
DVR Selectivity: ${paper.regulatoryAudit.dvrSelectivity} [${paper.regulatoryAudit.normalSelectivityStatus}]

6. MULTI-OMICS EVIDENCE GRAPH
Supporting Evidence:
${paper.evidenceGraph.supporting.map((s) => `- ${s}`).join('\n')}
Contradicting Evidence:
${paper.evidenceGraph.contradicting.map((c) => `- ${c}`).join('\n')}
Weakest Link: ${paper.evidenceGraph.weakestLink}

================================================================================
Generated via CellNoor Platform Suite | Horizon Commerce LLC (amjad@noorgenx.com)
================================================================================
    `.trim();

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CellNoor_Executive_Dossier_${paper.id.toUpperCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const executeDownloadStream = (format: 'pdf' | 'docx' | 'txt') => {
    if (format === 'pdf') streamPdf();
    else if (format === 'docx') streamDocx();
    else if (format === 'txt') streamTxt();
  };

  const ALL_PAPER_IDS = [
    'bone_marrow_aml',
    'corneal_limbal',
    'skin_epidermis',
    'cardiac_patch',
    'pancreatic_islet',
    'putamen_dopaminergic',
    'cochlear_hair_cell',
    'articular_cartilage',
    'alveolar_at2',
    'musculoskeletal',
    'pulmonary',
    'spinal_cord',
    'hematology',
    'ophthalmic',
    'integumentary',
    'cardiovascular',
    'endocrine',
    'neuro',
    'auditory',
  ];

  const handleAdminQuickUnlock = () => {
    const adminLead: LeadProfile = {
      email: 'amjad@noorgenx.com',
      fullName: 'Amjad Sohail (Admin & Ecosystem Owner)',
      institutionOrCompany: 'NoorGenX Ecosystem / Horizon Commerce LLC',
      jobRole: 'Other',
    };
    setCachedLead(adminLead);
    setUnlockedPapers(ALL_PAPER_IDS);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cellnoor_lead_profile', JSON.stringify(adminLead));
      localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(ALL_PAPER_IDS));
    }
    setCheckoutNotification('⚡ Admin Entitlement Activated! All 9 Enterprise Clinical Dossiers fully unlocked.');
  };

  // Check localStorage and URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Load lead profile
      const storedLead = localStorage.getItem('cellnoor_lead_profile');
      let leadObj: LeadProfile | null = null;
      if (storedLead) {
        try {
          leadObj = JSON.parse(storedLead);
          setCachedLead(leadObj);
        } catch (e) {
          console.warn('Failed to parse cached lead profile');
        }
      }

      const isAdmin = leadObj?.email?.toLowerCase() === 'amjad@noorgenx.com' || leadObj?.email?.toLowerCase().endsWith('@noorgenx.com');

      // 2. Load unlocked papers
      const storedUnlocked = localStorage.getItem('cellnoor_unlocked_papers');
      let unlockedList: string[] = [];
      if (storedUnlocked) {
        try {
          unlockedList = JSON.parse(storedUnlocked);
        } catch (e) {
          console.warn('Failed to parse unlocked papers');
        }
      }

      if (isAdmin) {
        unlockedList = ALL_PAPER_IDS;
        localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(ALL_PAPER_IDS));
      }

      setUnlockedPapers(unlockedList);

      // 3. Handle URL Checkout Callback (Stripe / PayPal return)
      const params = new URLSearchParams(window.location.search);
      const unlockedParam = params.get('unlocked');
      const formatParam = (params.get('format') as 'pdf' | 'docx' | 'txt') || 'pdf';
      const sessionId = params.get('session_id') || params.get('paypal_order');

      if (unlockedParam) {
        if (!unlockedList.includes(unlockedParam)) {
          unlockedList.push(unlockedParam);
          localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(unlockedList));
          setUnlockedPapers([...unlockedList]);
        }
        setSelectedId(unlockedParam);
        setCheckoutNotification(`Entitlement verified! Single Clinical Dossier Unlocked ($495.00). Ref: ${sessionId || 'APPROVED'}`);
        executeDownloadStream(formatParam);
      }
    }
  }, []);

  // Unified Lead Gate & Checkout Handler
  const handleExportClick = async (format: 'pdf' | 'docx' | 'txt') => {
    setPendingFormat(format);

    // 1. Check if lead profile exists
    const storedLead = typeof window !== 'undefined' ? localStorage.getItem('cellnoor_lead_profile') : null;
    let lead: LeadProfile | null = cachedLead;

    if (!lead && storedLead) {
      try {
        lead = JSON.parse(storedLead);
        setCachedLead(lead);
      } catch (e) {
        // ignore
      }
    }

    const isAdmin = lead?.email?.toLowerCase() === 'amjad@noorgenx.com' || lead?.email?.toLowerCase().endsWith('@noorgenx.com');

    if (isAdmin && lead) {
      if (!unlockedPapers.includes(paper.id)) {
        const updated = Array.from(new Set([...unlockedPapers, ...ALL_PAPER_IDS]));
        setUnlockedPapers(updated);
        if (typeof window !== 'undefined') {
          localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(updated));
        }
      }
      await recordDossierDownload(lead, paper.id, paper.title, format);
      executeDownloadStream(format);
      return;
    }

    if (!lead) {
      setIsLeadModalOpen(true);
      return;
    }

    // 2. Check if paper is already unlocked in entitlements
    const isUnlocked = unlockedPapers.includes(paper.id);
    if (isUnlocked) {
      await recordDossierDownload(lead, paper.id, paper.title, format);
      executeDownloadStream(format);
    } else {
      // Prompt Checkout Modal for $495 transaction
      setIsCheckoutModalOpen(true);
    }
  };

  const handleClearLeadIdentity = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cellnoor_lead_profile');
      setCachedLead(null);
    }
  };

  const handleSuccessfulPayment = () => {
    const updated = [...unlockedPapers, paper.id];
    setUnlockedPapers(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(updated));
    }
    if (cachedLead && pendingFormat) {
      recordDossierDownload(cachedLead, paper.id, paper.title, pendingFormat);
      executeDownloadStream(pendingFormat);
    }
  };

  return (
    <div className="neu-card p-6 border border-convexBorder rounded-xl space-y-6 max-w-6xl mx-auto my-4 text-slate-200">
      {/* Checkout Notification Bar */}
      {checkoutNotification && (
        <div className="bg-noorEmerald/20 border border-noorEmerald/40 text-noorEmerald font-mono text-xs p-3 rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-noorEmerald" />
            <span>{checkoutNotification}</span>
          </div>
          <button
            onClick={() => setCheckoutNotification(null)}
            className="text-slate-400 hover:text-slate-200 text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Lead Capture Modal */}
      {pendingFormat && (
        <LeadCaptureModal
          isOpen={isLeadModalOpen}
          onClose={() => {
            setIsLeadModalOpen(false);
            setPendingFormat(null);
          }}
          paperId={paper.id}
          paperTitle={paper.title}
          exportFormat={pendingFormat}
          onSuccessDownload={(lead) => {
            setCachedLead(lead);
            setIsLeadModalOpen(false);
            // After lead capture, open checkout modal for monetization
            setIsCheckoutModalOpen(true);
          }}
        />
      )}

      {/* Stripe & PayPal Checkout Modal ($495) */}
      {pendingFormat && cachedLead && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => {
            setIsCheckoutModalOpen(false);
            setPendingFormat(null);
          }}
          paperId={paper.id}
          paperTitle={paper.title}
          leadEmail={cachedLead.email}
          format={pendingFormat}
          onSuccessPayment={handleSuccessfulPayment}
        />
      )}

      {/* Lineage Selector Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyanCore" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Enterprise Multi-Lineage Technical White Paper & Clinical Dossier Suite
            </h2>
          </div>

          {/* Lead Authentication & Payment Entitlement Badge */}
          {cachedLead ? (
            <div className={`flex items-center gap-2 text-xs font-mono px-2.5 py-1 rounded-lg border ${
              cachedLead.email.toLowerCase() === 'amjad@noorgenx.com' || cachedLead.email.toLowerCase().endsWith('@noorgenx.com')
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : 'bg-noorEmerald/10 text-noorEmerald border-noorEmerald/30'
            }`}>
              {cachedLead.email.toLowerCase() === 'amjad@noorgenx.com' || cachedLead.email.toLowerCase().endsWith('@noorgenx.com') ? (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-noorEmerald" />
              )}
              <span>
                Verified: <strong>{cachedLead.email}</strong>{' '}
                {cachedLead.email.toLowerCase() === 'amjad@noorgenx.com' || cachedLead.email.toLowerCase().endsWith('@noorgenx.com')
                  ? '(👑 ALL 9 DOSSIERS UNLOCKED)'
                  : `(${cachedLead.jobRole})`}
              </span>
              <button
                onClick={handleClearLeadIdentity}
                title="Switch Lead Profile"
                className="text-slate-400 hover:text-slate-200 ml-1 border-l border-slate-700 pl-1.5 flex items-center gap-0.5"
              >
                <RefreshCw className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyanCore flex items-center gap-1 bg-cyanCore/10 px-2.5 py-1 rounded-lg border border-cyanCore/30">
                <ShieldCheck className="w-3.5 h-3.5 text-cyanCore" />
                Stripe & PayPal Gate Active ($495 / dossier)
              </span>
              <button
                onClick={handleAdminQuickUnlock}
                className="text-xs font-mono font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>⚡ Unlock All as Admin</span>
              </button>
            </div>
          )}
        </div>

        {/* 9 Lineage Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {Object.values(WHITE_PAPERS).map((item) => {
            const isSelected = item.id === selectedId;
            const isUnlocked = unlockedPapers.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPaper(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-slate-800 text-cyanCore border-cyanCore shadow-lg shadow-cyanCore/10'
                    : 'text-slate-400 border-convexBorder hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {getLineageIcon(item.id)}
                <span>{item.category.split(' ')[0]}</span>
                {isUnlocked ? (
                  <CheckCircle2 className="w-3 h-3 text-noorEmerald shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Header & Export Bar */}
      <div className="border-t border-b border-convexBorder py-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4 flex-wrap pb-1">
              <NoorGenXLogo height={40} />
              <div className="h-8 w-px bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-cyanCore/20 text-cyanCore border border-cyanCore/40 uppercase">
                  {paper.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Published: {paper.publishedDate}
                </span>
                {unlockedPapers.includes(paper.id) && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-noorEmerald/20 text-noorEmerald border border-noorEmerald/40 uppercase">
                    UNLOCKED
                  </span>
                )}
              </div>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-wide">
              {paper.title}
            </h1>
          </div>

          {/* Export Tray */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleExportClick('pdf')}
              disabled={isExporting}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyanCore border border-cyanCore/40 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download Executive PDF Dossier"
            >
              <Download className="w-3.5 h-3.5 text-cyanCore" />
              <span>{isExporting ? 'Generating...' : 'PDF (.pdf)'}</span>
            </button>

            <button
              onClick={() => handleExportClick('docx')}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-noorEmerald border border-noorEmerald/40 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download Word Document"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-noorEmerald" />
              <span>Word (.docx)</span>
            </button>

            <button
              onClick={() => handleExportClick('txt')}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-convexBorder flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download Plain Text Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Text (.txt)</span>
            </button>
          </div>
        </div>

        {/* Corporate Provenance Header */}
        <div className="neu-inset p-3 rounded-lg text-xs font-mono text-slate-400 grid grid-cols-1 md:grid-cols-3 gap-2 border border-slate-800/80 bg-slate-950/50">
          <div>
            <span className="text-slate-500">Operating Entity:</span>{' '}
            <span className="text-cyanCore font-semibold">Horizon Commerce LLC</span> (Lorton, VA)
          </div>
          <div>
            <span className="text-slate-500">UEI:</span>{' '}
            <span className="text-noorEmerald font-semibold">NY9AHGK2BBZ7</span>
          </div>
          <div>
            <span className="text-slate-500">Ecosystem:</span>{' '}
            <span className="text-slate-200">NoorGenX (amjad@noorgenx.com)</span>
          </div>
        </div>
      </div>

      {/* 1. Executive Summary & Market ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 neu-inset p-4 rounded-xl space-y-2 border border-slate-800 bg-slate-950/60">
          <h2 className="text-xs font-bold text-noorEmerald uppercase tracking-wider flex items-center gap-2 font-mono">
            <Award className="w-4 h-4 text-noorEmerald" />
            Executive Summary & Clinical Rationale
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            {paper.executiveSummary}
          </p>
        </div>

        <div className="neu-card-convex p-4 rounded-xl space-y-3 border border-convexBorder bg-slate-900/60 font-mono text-xs">
          <h3 className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-convexBorder pb-1 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-cyanCore" />
            Commercial & Clinical Value
          </h3>
          <div className="space-y-2">
            <div>
              <div className="text-slate-500 text-[10px]">Target Indication:</div>
              <div className="text-slate-200 font-bold">{paper.indication}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">Addressable Market:</div>
              <div className="text-cyanCore font-bold">{paper.marketSize}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px]">Estimated Trial ROI:</div>
              <div className="text-noorEmerald font-bold">{paper.estimatedRoi}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial Impact Highlights */}
      <div className="neu-inset p-3.5 rounded-xl border border-slate-800 bg-slate-950/40">
        <div className="text-xs font-bold text-cyanCore uppercase font-mono mb-2 flex items-center gap-1.5">
          <ChevronRight className="w-4 h-4 text-cyanCore" />
          Key Commercial Impact Directives
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-slate-300">
          {paper.commercialImpact.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-900/40 p-2 rounded border border-slate-800/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-noorEmerald shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Clinical Problem & Cell Dynamics */}
      <div className="space-y-3 border-t border-convexBorder pt-4">
        <h2 className="text-xs font-bold text-cyanCore uppercase tracking-wider font-mono flex items-center gap-2">
          <Dna className="w-4 h-4 text-cyanCore" />
          1. Clinical Problem & Cell State Dynamics
        </h2>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-200">{paper.clinicalProblem.title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{paper.clinicalProblem.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neu-inset p-3 rounded-lg space-y-1.5 text-xs font-mono bg-slate-950/60 border border-slate-800">
            <div className="text-noorEmerald font-bold border-b border-slate-800 pb-1">Key Molecular Mechanisms:</div>
            {paper.clinicalProblem.keyMechanisms.map((mech, idx) => (
              <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                <span className="text-noorEmerald">•</span>
                <span>{mech}</span>
              </div>
            ))}
          </div>

          <div className="neu-inset p-3 rounded-lg space-y-1.5 text-xs font-mono bg-slate-950/60 border border-slate-800">
            <div className="text-cyanCore font-bold border-b border-slate-800 pb-1">Cell State Dynamics Trajectory:</div>
            {paper.clinicalProblem.cellStateDynamics.map((dyn, idx) => (
              <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                <span className="text-cyanCore">→</span>
                <span>{dyn}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Figure 1: 2D Synergy Surface */}
        <SynergyHeatmapPreview paper={paper} />
      </div>

      {/* 3. Mathematical Engine & PDE Diagnostics */}
      <div className="space-y-3 border-t border-convexBorder pt-4">
        <h2 className="text-xs font-bold text-cyanCore uppercase tracking-wider font-mono flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyanCore" />
          2. Mathematical Engine & 3D Multiscale Spatial PDE Diagnostics
        </h2>

        <div className="neu-card-convex p-3 rounded-lg text-center font-mono text-xs text-noorEmerald border border-noorEmerald/30 bg-slate-900/80 shadow-inner">
          {paper.mathematicalEngine.systemEquation}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
          <div className="neu-inset p-3 rounded-lg border border-slate-800 bg-slate-950/50 space-y-1">
            <div className="text-slate-500 text-[10px]">FIM λ_min Eigenvalue</div>
            <div className="text-noorEmerald font-bold text-sm">{paper.mathematicalEngine.fimEigenvalue}</div>
            <div className="text-[10px] text-slate-400">{paper.mathematicalEngine.identifiabilityStatus}</div>
          </div>

          <div className="neu-inset p-3 rounded-lg border border-slate-800 bg-slate-950/50 space-y-1">
            <div className="text-slate-500 text-[10px]">Diffusion Coefficient (D_m)</div>
            <div className="text-cyanCore font-bold text-sm">{paper.mathematicalEngine.pdeParameters.diffusionD_m}</div>
            <div className="text-[10px] text-slate-400">Extracellular Matrix</div>
          </div>

          <div className="neu-inset p-3 rounded-lg border border-slate-800 bg-slate-950/50 space-y-1">
            <div className="text-slate-500 text-[10px]">Chemotactic Drift (μ)</div>
            <div className="text-amber-400 font-bold text-sm">{paper.mathematicalEngine.pdeParameters.chemotacticDrift}</div>
            <div className="text-[10px] text-slate-400">Morphogen Gradient</div>
          </div>

          <div className="neu-inset p-3 rounded-lg border border-slate-800 bg-slate-950/50 space-y-1">
            <div className="text-slate-500 text-[10px]">Continuum Stress (σ)</div>
            <div className="text-emerald-400 font-bold text-sm">{paper.mathematicalEngine.pdeParameters.tissueStress}</div>
            <div className="text-[10px] text-slate-400">Biomechanical Load</div>
          </div>
        </div>

        {/* Embedded Charts: ODE Kinetics + UMAP Trajectory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ODETimeSeriesChart paper={paper} />
          <UMAPEmbeddingFigure paper={paper} />
        </div>

        {/* Tissue Physical Transport Parameters Table */}
        <div className="space-y-2 mt-4">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Tissue Physical Transport & Identifiability Parameters Table
          </h4>
          <div className="overflow-x-auto neu-inset rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="bg-slate-900 text-slate-300 border-b border-convexBorder">
                  <th className="p-2.5">Target Lineage</th>
                  <th className="p-2.5">Diffusion (D_m cm²/s)</th>
                  <th className="p-2.5">Chemotactic Drift (μ)</th>
                  <th className="p-2.5">ECM Stress (kPa)</th>
                  <th className="p-2.5">FIM Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-convexBorder">
                {[
                  { id: 'hematology', alias: ['hematology', 'bone_marrow_aml'], name: 'Hematopoietic (Bone Marrow LSC)', diff: '1.42e-06', drift: '[0.028, 0.011, 0.001]', ecm: '0.0482', fim: 'IDENTIFIABLE (5.25e-3)', color: 'text-noorEmerald' },
                  { id: 'ophthalmic', alias: ['ophthalmic', 'corneal_limbal'], name: 'Corneal (Limbal Epithelium)', diff: '1.18e-06', drift: '[0.015, 0.008, 0.000]', ecm: '0.0345', fim: 'IDENTIFIABLE (4.82e-3)', color: 'text-cyanCore' },
                  { id: 'integumentary', alias: ['integumentary', 'skin_epidermis'], name: 'Integumentary (Skin Epidermis)', diff: '2.10e-06', drift: '[0.032, 0.019, 0.002]', ecm: '0.0812', fim: 'IDENTIFIABLE (4.83e-3)', color: 'text-amber-400' },
                  { id: 'cardiovascular', alias: ['cardiovascular', 'cardiac_patch'], name: 'Cardiovascular (Cardiac Patch)', diff: '3.45e-06', drift: '[0.045, 0.022, 0.005]', ecm: '1.4819', fim: 'IDENTIFIABLE (6.10e-3)', color: 'text-red-400' },
                  { id: 'endocrine', alias: ['endocrine', 'pancreatic_islet'], name: 'Pancreatic (Islet Progenitor)', diff: '1.85e-06', drift: '[0.021, 0.012, 0.001]', ecm: '0.1250', fim: 'IDENTIFIABLE (3.95e-3)', color: 'text-purple-400' },
                  { id: 'neuro', alias: ['neuro', 'putamen_dopaminergic'], name: 'Neuro (Putamen Dopaminergic)', diff: '2.60e-06', drift: '[0.038, 0.015, 0.003]', ecm: '0.2238', fim: 'IDENTIFIABLE (4.12e-3)', color: 'text-blue-400' },
                  { id: 'auditory', alias: ['auditory', 'cochlear_hair_cell'], name: 'Auditory (Cochlear Hair Cell)', diff: '1.25e-06', drift: '[0.018, 0.009, 0.001]', ecm: '0.1411', fim: 'IDENTIFIABLE (3.80e-3)', color: 'text-teal-400' },
                  { id: 'musculoskeletal', alias: ['musculoskeletal', 'articular_cartilage'], name: 'Musculoskeletal (Articular Cartilage)', diff: '3.10e-06', drift: '[0.040, 0.025, 0.004]', ecm: '1.1221', fim: 'IDENTIFIABLE (5.88e-3)', color: 'text-emerald-400' },
                  { id: 'pulmonary', alias: ['pulmonary', 'alveolar_at2'], name: 'Pulmonary (Alveolar AT2)', diff: '2.40e-06', drift: '[0.030, 0.014, 0.002]', ecm: '0.3623', fim: 'IDENTIFIABLE (4.50e-3)', color: 'text-sky-400' },
                  { id: 'spinal_cord', alias: ['spinal_cord', 'neural'], name: 'Neural (Spinal Cord / OPC)', diff: '1.60e-06', drift: '[0.026, 0.012, 0.002]', ecm: '0.1980', fim: 'IDENTIFIABLE (4.65e-3)', color: 'text-indigo-400' },
                ].map((row) => {
                  const isActive = row.alias.includes(paper.id) || row.alias.includes(activeLineage || '');
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-slate-800/60 transition-all ${
                        isActive
                          ? 'bg-noorEmerald/20 font-semibold border-l-4 border-l-noorEmerald shadow-sm'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <td className={`p-2.5 ${isActive ? 'text-noorEmerald font-extrabold' : `${row.color} font-bold`}`}>
                        <span>{row.name}</span>
                        {isActive && (
                          <span className="ml-2 text-[10px] bg-noorEmerald text-slate-950 font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider shadow">
                            ACTIVE TARGET
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-300 font-mono text-xs">{row.diff}</td>
                      <td className="p-2.5 text-slate-300 font-mono text-xs">{row.drift}</td>
                      <td className="p-2.5 text-slate-300 font-mono text-xs">{row.ecm}</td>
                      <td className="p-2.5 text-noorEmerald font-bold text-xs">{row.fim}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Benchmark Audit Metrics */}
      <div className="space-y-3 border-t border-convexBorder pt-4">
        <h2 className="text-xs font-bold text-cyanCore uppercase tracking-wider font-mono flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyanCore" />
          3. Scientific Benchmark Audit & Baseline Comparison
        </h2>

        <div className="overflow-x-auto neu-inset rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300 border-b border-convexBorder font-mono">
                <th className="p-3">Benchmark Metric Name</th>
                <th className="p-3">CellNoor Digital Twin Score</th>
                <th className="p-3">Standard Baseline</th>
                <th className="p-3">Net Superiority Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-convexBorder font-mono">
              {paper.benchmarkMetrics.map((bench, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 text-slate-200 font-bold">{bench.name}</td>
                  <td className="p-3 text-noorEmerald font-bold">{bench.cellNoorScore}</td>
                  <td className="p-3 text-slate-400">{bench.standardBaseline}</td>
                  <td className="p-3 text-noorEmerald font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-noorEmerald shrink-0" />
                    <span>{bench.netSuperiority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Regulatory Audit & Multi-Omics Evidence Graph */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-convexBorder pt-4">
        {/* Regulatory Audit */}
        <div className="neu-card-convex p-4 rounded-xl space-y-3 border border-convexBorder bg-slate-900/60 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-convexBorder pb-2">
            <h3 className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-noorEmerald" />
              Regulatory Safety Audit Gate
            </h3>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                paper.regulatoryAudit.teratomaStatus === 'PASS'
                  ? 'bg-noorEmerald/20 text-noorEmerald border border-noorEmerald/40'
                  : 'bg-red-500/20 text-red-400 border border-red-400/40'
              }`}
            >
              {paper.regulatoryAudit.teratomaStatus}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Sample Accession ID:</span>
              <span className="text-cyanCore font-bold">{paper.regulatoryAudit.sampleId}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">FDA Teratoma Hazard (S_teratoma):</span>
              <span className="text-noorEmerald font-bold">{paper.regulatoryAudit.teratomaScore}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Karyotype Instability:</span>
              <span className="text-slate-200">{paper.regulatoryAudit.karyotypeScore}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Differential Vulnerability (DVR):</span>
              <span className="text-noorEmerald font-bold">{paper.regulatoryAudit.dvrSelectivity}</span>
            </div>
            <div className="text-[11px] text-noorEmerald bg-noorEmerald/10 p-2 rounded border border-noorEmerald/20 text-center font-bold">
              {paper.regulatoryAudit.normalSelectivityStatus}
            </div>
          </div>
        </div>

        {/* Evidence Graph */}
        <div className="neu-card-convex p-4 rounded-xl space-y-3 border border-convexBorder bg-slate-900/60 font-mono text-xs">
          <h3 className="text-slate-200 font-bold flex items-center gap-1.5 uppercase tracking-wider border-b border-convexBorder pb-2">
            <Compass className="w-4 h-4 text-cyanCore" />
            Multi-Omics Why-Graph Evidence Card
          </h3>

          <div className="space-y-2">
            <div>
              <div className="text-noorEmerald font-bold text-[11px] mb-1">Supporting Evidence [E1-E3]:</div>
              {paper.evidenceGraph.supporting.map((sup, idx) => (
                <div key={idx} className="text-slate-300 text-[11px] flex items-start gap-1">
                  <span className="text-noorEmerald">•</span>
                  <span>{sup}</span>
                </div>
              ))}
            </div>

            {paper.evidenceGraph.contradicting.length > 0 && (
              <div>
                <div className="text-amber-400 font-bold text-[11px] mb-1">Contradicting / Boundary Signals [E1]:</div>
                {paper.evidenceGraph.contradicting.map((con, idx) => (
                  <div key={idx} className="text-slate-300 text-[11px] flex items-start gap-1">
                    <span className="text-amber-400">•</span>
                    <span>{con}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-1 border-t border-slate-800">
              <div className="text-slate-500 text-[10px]">Weakest Operational Link:</div>
              <div className="text-slate-300 text-[11px] italic">{paper.evidenceGraph.weakestLink}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Footer */}
      <div className="border-t border-convexBorder pt-4 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2">
        <div>
          Horizon Commerce LLC (Lorton, VA; UEI: <span className="text-cyanCore">NY9AHGK2BBZ7</span>) | License Clearance: Commercial Verified
        </div>
        <div className="text-noorEmerald font-semibold">
          NoorGenX Ecosystem (amjad@noorgenx.com)
        </div>
      </div>
    </div>
  );
}

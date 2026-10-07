'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, X, Building, Mail, User, Briefcase, Sparkles } from 'lucide-react';
import { LeadProfile, recordDossierDownload } from '../lib/firebaseDossier';
import NoorGenXLogo from './brand/NoorGenXLogo';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  paperId: string;
  paperTitle: string;
  exportFormat: 'pdf' | 'docx' | 'txt';
  onSuccessDownload: (lead: LeadProfile) => void;
}

export default function LeadCaptureModal({
  isOpen,
  onClose,
  paperId,
  paperTitle,
  exportFormat,
  onSuccessDownload,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [institutionOrCompany, setInstitutionOrCompany] = useState('');
  const [jobRole, setJobRole] = useState<LeadProfile['jobRole']>('Pharma_BD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!institutionOrCompany.trim()) {
      setErrorMsg('Please enter your institution or company name.');
      return;
    }

    setIsSubmitting(true);
    const lead: LeadProfile = {
      email: email.trim(),
      fullName: fullName.trim(),
      institutionOrCompany: institutionOrCompany.trim(),
      jobRole,
    };

    const isAdmin = email.trim().toLowerCase() === 'amjad@noorgenx.com' || email.trim().toLowerCase().endsWith('@noorgenx.com');

    try {
      await recordDossierDownload(lead, paperId, paperTitle, exportFormat);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cellnoor_lead_profile', JSON.stringify(lead));
        if (isAdmin) {
          const ALL_PAPERS = ['bone_marrow_aml', 'corneal_limbal', 'skin_epidermis', 'cardiac_patch', 'pancreatic_islet', 'putamen_dopaminergic', 'cochlear_hair_cell', 'articular_cartilage', 'alveolar_at2'];
          localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(ALL_PAPERS));
        }
      }
      onSuccessDownload(lead);
      onClose();
    } catch (err) {
      console.error('Lead record submission error:', err);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cellnoor_lead_profile', JSON.stringify(lead));
        if (isAdmin) {
          const ALL_PAPERS = ['bone_marrow_aml', 'corneal_limbal', 'skin_epidermis', 'cardiac_patch', 'pancreatic_islet', 'putamen_dopaminergic', 'cochlear_hair_cell', 'articular_cartilage', 'alveolar_at2'];
          localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(ALL_PAPERS));
        }
      }
      onSuccessDownload(lead);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminUnlock = async () => {
    const adminLead: LeadProfile = {
      email: 'amjad@noorgenx.com',
      fullName: 'Amjad Sohail (Admin)',
      institutionOrCompany: 'NoorGenX Ecosystem / Horizon Commerce LLC',
      jobRole: 'Other',
    };
    if (typeof window !== 'undefined') {
      const ALL_PAPERS = ['bone_marrow_aml', 'corneal_limbal', 'skin_epidermis', 'cardiac_patch', 'pancreatic_islet', 'putamen_dopaminergic', 'cochlear_hair_cell', 'articular_cartilage', 'alveolar_at2'];
      localStorage.setItem('cellnoor_unlocked_papers', JSON.stringify(ALL_PAPERS));
      localStorage.setItem('cellnoor_lead_profile', JSON.stringify(adminLead));
    }
    try {
      await recordDossierDownload(adminLead, paperId, paperTitle, exportFormat);
    } catch (e) {
      // ignore
    }
    onSuccessDownload(adminLead);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg neu-card p-6 border border-convexBorder rounded-2xl space-y-5 bg-[#121824] text-slate-200 shadow-2xl shadow-cyanCore/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg border border-transparent hover:border-convexBorder"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8">
          <div className="flex items-center gap-2">
            <NoorGenXLogo className="h-7" />
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyanCore/20 text-cyanCore border border-cyanCore/40 uppercase flex items-center gap-1">
              <Lock className="w-3 h-3 text-cyanCore" />
              Sovereign B2B Lead Access
            </span>
            <span className="text-[10px] font-mono text-noorEmerald font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-noorEmerald" />
              Audited Provenance
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-100 tracking-wide font-mono">
            Unlock Enterprise Clinical Dossier
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Enter your professional credentials to instantly generate and stream this audited clinical dossier formatted as{' '}
            <strong className="text-cyanCore uppercase">{exportFormat}</strong> with SHA-256 regulatory provenance.
          </p>
        </div>

        {/* Admin Quick Unlock Banner */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2 text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Admin Access Mode Available</span>
          </div>
          <button
            type="button"
            onClick={handleAdminUnlock}
            className="px-3 py-1.5 rounded-lg font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer shadow-md text-[11px] whitespace-nowrap"
          >
            ⚡ Unlock All as Admin
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 p-2.5 rounded-lg font-mono">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3 font-mono text-xs">
            {/* Work Email */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyanCore" />
                Work / Professional Email *
              </label>
              <input
                type="email"
                required
                placeholder="doctor@biotech-pharma.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-convexBorder rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyanCore transition-colors"
              />
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-noorEmerald" />
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Dr. Alexander Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-900 border border-convexBorder rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyanCore transition-colors"
              />
            </div>

            {/* Institution / Company */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-amber-400" />
                Institution / Company / Biotech *
              </label>
              <input
                type="text"
                required
                placeholder="OncoRegen Therapeutics / Johns Hopkins"
                value={institutionOrCompany}
                onChange={(e) => setInstitutionOrCompany(e.target.value)}
                className="w-full bg-slate-900 border border-convexBorder rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyanCore transition-colors"
              />
            </div>

            {/* Job Role */}
            <div className="space-y-1">
              <label className="text-slate-400 font-bold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                Professional Role *
              </label>
              <select
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value as any)}
                className="w-full bg-slate-900 border border-convexBorder rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-cyanCore transition-colors"
              >
                <option value="Pharma_BD">Pharma Business Development / Licensing</option>
                <option value="Oncologist">Clinical Oncologist / Physician</option>
                <option value="Translational_Researcher">Translational Stem Cell Researcher</option>
                <option value="Investor">Venture Capital / Healthcare Investor</option>
                <option value="Student_Academic">Academic Faculty / Scientist</option>
                <option value="Other">Other Executive / Consultant</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl text-xs font-mono font-bold bg-cyanCore hover:bg-cyan-400 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyanCore/20 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-slate-950" />
            <span>{isSubmitting ? 'Recording Telemetry...' : 'Unlock & Download Dossier'}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>

        {/* Corporate Privacy Compliance Footer */}
        <div className="border-t border-slate-800 pt-3 text-[10px] font-mono text-slate-500 text-center leading-relaxed">
          Horizon Commerce LLC (Lorton, VA; UEI: <span className="text-cyanCore">NY9AHGK2BBZ7</span>)<br />
          NoorGenX Ecosystem (<span className="text-noorEmerald">amjad@noorgenx.com</span>) | Encrypted B2B Pipeline Analytics
        </div>
      </div>
    </div>
  );
}

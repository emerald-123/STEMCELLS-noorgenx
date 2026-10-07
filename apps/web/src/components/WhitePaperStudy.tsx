'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Eye,
  Sparkles,
  Heart,
  Activity,
  Brain,
  Volume2,
  Bone,
  Wind,
  Zap,
} from 'lucide-react';
import WhitePaperView from './WhitePaperView';

export interface LineagePill {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const LINEAGE_PILLS: LineagePill[] = [
  { id: 'hematology', label: 'Hematology', icon: 'ShieldAlert', color: 'emerald' },
  { id: 'ophthalmic', label: 'Ophthalmic', icon: 'Eye', color: 'cyan' },
  { id: 'integumentary', label: 'Integumentary', icon: 'Sparkles', color: 'amber' },
  { id: 'cardiovascular', label: 'Cardiovascular', icon: 'Heart', color: 'rose' },
  { id: 'endocrine', label: 'Endocrine', icon: 'Activity', color: 'purple' },
  { id: 'neuro', label: 'Neuro (Putamen)', icon: 'Brain', color: 'indigo' },
  { id: 'auditory', label: 'Auditory', icon: 'Volume2', color: 'sky' },
  { id: 'musculoskeletal', label: 'Cartilage / Joint', icon: 'Bone', color: 'blue' },
  { id: 'pulmonary', label: 'Pulmonary / Lung', icon: 'Wind', color: 'teal' },
  { id: 'spinal_cord', label: 'Spinal Cord', icon: 'Zap', color: 'violet' },
];

export default function WhitePaperStudy() {
  const [activeLineage, setActiveLineage] = useState<string>('hematology');

  const handleLineageSelect = (id: string) => {
    setActiveLineage(id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cellnoor:lineage_change', {
          detail: { lineageId: id },
        })
      );
    }
  };

  const getPillIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldAlert':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'Eye':
        return <Eye className="w-3.5 h-3.5" />;
      case 'Sparkles':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'Heart':
        return <Heart className="w-3.5 h-3.5" />;
      case 'Activity':
        return <Activity className="w-3.5 h-3.5" />;
      case 'Brain':
        return <Brain className="w-3.5 h-3.5" />;
      case 'Volume2':
        return <Volume2 className="w-3.5 h-3.5" />;
      case 'Bone':
        return <Bone className="w-3.5 h-3.5" />;
      case 'Wind':
        return <Wind className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      default:
        return <Activity className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Lineage Category Navigation Bar */}
      <div className="neu-card p-3 border border-convexBorder rounded-xl bg-slate-900/90 overflow-x-auto scrollbar-thin">
        <div className="flex items-center gap-2 min-w-max">
          {LINEAGE_PILLS.map((pill) => {
            const isActive = activeLineage === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => handleLineageSelect(pill.id)}
                className={`px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyanCore border-cyanCore shadow-lg shadow-cyanCore/10'
                    : 'text-slate-400 border-convexBorder hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                {getPillIcon(pill.icon)}
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Technical White Paper Dossier View */}
      <WhitePaperView activeLineage={activeLineage} onSelectLineage={handleLineageSelect} />
    </div>
  );
}

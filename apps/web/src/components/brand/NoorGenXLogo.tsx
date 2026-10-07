import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export const NoorGenXLogo: React.FC<LogoProps> = ({ className = 'h-8', variant = 'dark' }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Crisp Hexagonal Emblem */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto aspect-square drop-shadow-sm shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldHex" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="starCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* 3D Chamfered Hexagon Base */}
        <polygon
          points="50,4 92,26 92,74 50,96 8,74 8,26"
          fill="url(#goldHex)"
          stroke="#B45309"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Center Spark / Star */}
        <path
          d="M 50 20 Q 50 50 20 50 Q 50 50 50 80 Q 50 50 80 50 Q 50 50 50 20 Z"
          fill="url(#starCyan)"
        />
      </svg>

      {/* Crisp Typography without compression noise */}
      <span className="font-extrabold tracking-tight text-xl flex items-baseline font-sans select-none whitespace-nowrap">
        <span className="text-[#0284C7]">Noor</span>
        <span className="text-[#0091FF]">Gen</span>
        <span className="text-[#38BDF8]">X</span>
        <span className="text-[10px] text-cyan-400 font-bold ml-0.5 align-super">TM</span>
      </span>
    </div>
  );
};

export default NoorGenXLogo;

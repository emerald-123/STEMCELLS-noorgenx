import React from 'react';

interface NoorGenXLogoProps {
  className?: string;
  height?: number;
  priority?: boolean;
}

export const NoorGenXLogo: React.FC<NoorGenXLogoProps> = ({
  className = '',
  height = 34,
}) => {
  // Aspect ratio of official trademark: 3.63 : 1
  const width = Math.round(height * 3.63);

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      <img
        src="/brand/noorgenx_trademark_clean.png"
        alt="NoorGenX™"
        width={width}
        height={height}
        style={{ height: `${height}px`, width: `${width}px` }}
        className="w-auto object-contain filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
      />
    </div>
  );
};

export default NoorGenXLogo;

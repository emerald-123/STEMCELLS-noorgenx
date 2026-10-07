import React from 'react';

interface NoorGenXLogoProps {
  className?: string;
  height?: number;
  priority?: boolean;
}

export const NoorGenXLogo: React.FC<NoorGenXLogoProps> = ({
  className = '',
  height = 36,
  priority = true,
}) => {
  // Original aspect ratio of the NoorGenX trademark logo is approximately 3.99 : 1
  const width = Math.round(height * 3.99);

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/brand/noorgenx_trademark_official.png"
        alt="NoorGenX™"
        height={height}
        width={width}
        style={{ height: `${height}px`, width: `${width}px` }}
        className="object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
};

export default NoorGenXLogo;

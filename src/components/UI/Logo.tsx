import React from 'react';

const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 36, className }) => (
  <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
    <rect width="64" height="64" rx="16" fill="#1F1A0A" />
    <rect x="13" y="37" width="10" height="15" rx="3" fill="#FFC107" />
    <rect x="27" y="28" width="10" height="24" rx="3" fill="#FFC107" />
    <rect x="41" y="23" width="10" height="29" rx="3" fill="#FFC107" />
    <circle cx="46" cy="13" r="6" fill="#fff" />
    <path d="M13 30 28 18l4 4" fill="none" stroke="#FFC107" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Logo;

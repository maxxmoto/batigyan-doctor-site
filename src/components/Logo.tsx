import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill="#0F766E"/>
    <text x="20" y="26" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">EB</text>
  </svg>
);
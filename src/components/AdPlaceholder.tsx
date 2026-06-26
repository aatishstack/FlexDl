/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AdPlaceholderProps {
  position: 'top-banner' | 'below-hero' | 'between-sections' | 'sidebar' | 'bottom-banner';
  id?: string;
}

export default function AdPlaceholder({ position, id = "ad-slot" }: AdPlaceholderProps) {
  // Return null by default so no spacing, placeholder, or container affects the layout
  // unless Google AdSense is explicitly enabled or configured.
  const isAdSenseConfigured = typeof window !== 'undefined' && (window as any).adsenseEnabled === true;
  if (!isAdSenseConfigured) {
    return null;
  }

  // Define dimensions and styles based on position if AdSense is enabled
  let containerStyles = "w-full mx-auto flex flex-col items-center justify-center rounded-xl transition-all duration-300 ";
  let label = "SPONSORED ADVERTISEMENT";
  let dimensions = "300x250";

  switch (position) {
    case 'top-banner':
      containerStyles += "max-w-7xl h-24 md:h-28 bg-neutral-950/40 border border-neutral-900 text-neutral-600 mb-6";
      dimensions = "728x90 Leaderboard / 970x90 Large Leaderboard";
      break;
    case 'below-hero':
      containerStyles += "max-w-4xl h-32 md:h-40 bg-neutral-950/60 border border-purple-950/20 text-neutral-600 mt-10 mb-8";
      dimensions = "728x90 Leaderboard / 320x50 Mobile Banner";
      break;
    case 'between-sections':
      containerStyles += "max-w-5xl h-32 md:h-36 bg-neutral-950/30 border border-neutral-900 text-neutral-600 my-12";
      dimensions = "970x250 Billboard / 728x90 Leaderboard";
      break;
    case 'sidebar':
      containerStyles += "w-full h-[500px] bg-neutral-950/50 border border-neutral-900 text-neutral-600 hidden lg:flex sticky top-24";
      dimensions = "300x600 Half Page / 160x600 Skyscraper";
      break;
    case 'bottom-banner':
      containerStyles += "max-w-5xl h-28 md:h-32 bg-neutral-950/40 border border-neutral-900 text-neutral-600 mt-16 mb-4";
      dimensions = "728x90 Leaderboard / 320x100 Large Mobile";
      break;
  }

  return (
    <div 
      id={`${id}-${position}`}
      className={`${containerStyles} relative overflow-hidden group select-none`}
      aria-hidden="true"
    >
      {/* Background neon effect */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(124,58,237,0.02)_0%,transparent_70%] group-hover:bg-radial-[circle_at_center,rgba(124,58,237,0.05)_0%,transparent_70%] transition-all duration-500" />
      
      {/* Dashed premium border line */}
      <div className="absolute inset-1 border border-dashed border-neutral-900/60 rounded-lg group-hover:border-purple-950/30 transition-colors duration-500" />

      {/* Info content */}
      <div className="relative z-10 text-center px-4">
        <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-purple-400/40 group-hover:text-purple-400/60 transition-colors duration-300">
          {label}
        </span>
        <h4 className="text-xs font-mono text-neutral-500 group-hover:text-neutral-400 mt-1 transition-colors duration-300">
          AdSense Container Ready
        </h4>
        <p className="text-[10px] text-neutral-600 font-mono mt-0.5">
          {dimensions}
        </p>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-neutral-800 group-hover:border-purple-900 transition-colors duration-300" />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-neutral-800 group-hover:border-purple-900 transition-colors duration-300" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-neutral-800 group-hover:border-purple-900 transition-colors duration-300" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-neutral-800 group-hover:border-purple-900 transition-colors duration-300" />
    </div>
  );
}

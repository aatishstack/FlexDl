/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  onBrandClick: () => void;
  onContactClick: () => void;
}

export default function Navbar({ onBrandClick, onContactClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo brand */}
        <div className="flex items-center gap-2.5 group cursor-pointer" onClick={onBrandClick}>
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white font-extrabold shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 fill-white animate-pulse" />
          </div>
          <span className="font-extrabold text-base md:text-lg text-white tracking-tight group-hover:text-purple-400 transition-colors">
            Flex<span className="text-brand">DL</span>
          </span>
        </div>

        {/* Minimal Links */}
        <nav className="flex items-center gap-5 text-xs font-semibold">
          <a href="#faq" className="text-neutral-400 hover:text-white transition-colors duration-200">
            FAQ
          </a>
          <button 
            onClick={onContactClick}
            className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold hover:bg-brand/20 hover:text-white transition-all duration-300 cursor-pointer"
          >
            Contact
          </button>
        </nav>
      </div>
    </header>
  );
}

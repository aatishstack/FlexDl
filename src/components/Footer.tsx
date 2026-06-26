/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface FooterProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onContactClick: () => void;
}

export default function Footer({ onTermsClick, onPrivacyClick, onContactClick }: FooterProps) {
  return (
    <footer className="bg-black border-t border-neutral-900/80 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand and Copy */}
        <div className="text-center md:text-left">
          <span className="font-extrabold text-sm text-white tracking-tight">
            Flex<span className="text-brand">DL</span>
          </span>
          <p className="text-xs text-neutral-500 mt-1">
            &copy; {new Date().getFullYear()} FlexDL. Built with 100% cloud privacy.
          </p>
        </div>

        {/* Legal / Contact buttons list */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
          <button 
            onClick={onTermsClick}
            className="hover:text-purple-400 transition-colors duration-200 cursor-pointer"
          >
            Terms of Service
          </button>
          <button 
            onClick={onPrivacyClick}
            className="hover:text-purple-400 transition-colors duration-200 cursor-pointer"
          >
            Privacy Policy
          </button>
          <button 
            onClick={onContactClick}
            className="hover:text-purple-400 transition-colors duration-200 cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    </footer>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';

interface DownloadFormProps {
  url: string;
  setUrl: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function DownloadForm({ url, setUrl, onSubmit, isLoading }: DownloadFormProps) {
  return (
    <div className="max-w-3xl mx-auto mb-4 relative z-20">
      <motion.form 
        onSubmit={onSubmit}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="glassmorphism p-1.5 rounded-2xl flex flex-col sm:flex-row gap-2 relative group"
      >
        <div className="absolute inset-0 bg-brand/5 group-focus-within:bg-brand/[0.08] transition-all duration-300 rounded-2xl pointer-events-none" />
        
        {/* Search Input Container */}
        <div className="flex-1 flex items-center pl-2.5 relative z-10">
          <Search className="w-4 h-4 text-neutral-500 group-focus-within:text-purple-400 shrink-0 transition-colors" />
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your video URL here..."
            className="w-full h-11 md:h-12 pl-2.5 bg-transparent border-0 text-white placeholder-neutral-500 text-xs md:text-sm focus:ring-0 focus:outline-none focus:border-0"
          />
          {url && (
            <button
              type="button"
              id="btn-clear-input"
              onClick={() => setUrl('')}
              className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 shrink-0 mr-1 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="btn-submit-download"
          disabled={isLoading}
          className="h-11 md:h-12 px-6 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs md:text-sm font-bold shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-98 transition-all shrink-0 flex items-center justify-center gap-1.5 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Extracting...
            </>
          ) : (
            <>
              Download
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </>
          )}
        </button>
      </motion.form>

      {/* Supported Platforms Compact Badges */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mr-1 select-none">
          Supported Platforms:
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-900/60 text-neutral-300 text-[10px] font-semibold hover:border-brand/20 hover:text-white transition-all duration-300 select-none">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
          YouTube
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-900/60 text-neutral-300 text-[10px] font-semibold hover:border-brand/20 hover:text-white transition-all duration-300 select-none">
          <span className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
          TikTok
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-900/60 text-neutral-300 text-[10px] font-semibold hover:border-brand/20 hover:text-white transition-all duration-300 select-none">
          <span className="w-1 h-1 rounded-full bg-pink-500 animate-pulse" />
          Instagram
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-900/60 text-neutral-300 text-[10px] font-semibold hover:border-brand/20 hover:text-white transition-all duration-300 select-none">
          <span className="w-1 h-1 rounded-full bg-sky-400 animate-pulse" />
          Twitter / X
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-950 border border-neutral-900/60 text-neutral-300 text-[10px] font-semibold hover:border-brand/20 hover:text-white transition-all duration-300 select-none">
          <span className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
          Direct Files
        </span>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export default function Hero() {
  return (
    <div className="text-center max-w-3xl mx-auto mt-2 md:mt-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/20 border border-brand/30 text-[10px] font-bold text-purple-400 tracking-wider uppercase mb-3 select-none">
          <ShieldCheck className="w-3 h-3" /> Fast, Secure & Anonymous
        </span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]"
      >
        Fast Video <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-400">Downloader</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed max-w-lg mx-auto"
      >
        Extract and stream clean multimedia formats directly from supported links.
      </motion.p>
    </div>
  );
}

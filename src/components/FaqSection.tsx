/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FaqItem } from '../types';

interface FaqRowProps {
  key?: any;
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

const FaqRow = ({ item, isOpen, onToggle, index }: FaqRowProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-neutral-900 last:border-b-0"
    >
      <button
        id={`faq-btn-${index}`}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="w-full py-5 flex items-center justify-between text-left group hover:text-purple-300 transition-colors duration-200"
      >
        <span className="text-sm md:text-base font-semibold text-neutral-200 group-hover:text-white transition-colors duration-200">
          {item.question}
        </span>
        <span className={`p-1.5 rounded-lg bg-neutral-950 border border-neutral-900 group-hover:border-purple-950 text-neutral-400 group-hover:text-purple-400 shrink-0 transition-all duration-300 ${isOpen ? 'rotate-180 bg-purple-950/20 border-brand/30' : ''}`}>
          <ChevronDown className="w-4 h-4" />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${index}`}
            role="region"
            aria-labelledby={`faq-btn-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-8 text-sm text-neutral-400 leading-relaxed space-y-2">
              <p>{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default

  const faqItems: FaqItem[] = [
    {
      question: "How does the FlexDL downloader work?",
      answer: "It is simple: copy the URL of the public video you want to grab, paste it into our download field, and click 'Download'. Our cloud backend instantly contacts the source server, parses the available formats (1080p, 720p, 480p, or Audio), and opens a direct, high-speed download link for your browser to fetch."
    },
    {
      question: "Is using FlexDL completely free?",
      answer: "Yes, FlexDL is 100% free to use. There are no speed caps, usage counts, subscription limits, or mandatory registration gates. We sustain our server bandwidth costs through clean, responsive, non-intrusive advertisement banners strategically placed on our page."
    },
    {
      question: "What types of content and platforms are supported?",
      answer: "We support extracting content from major public media hosts including standard video sharing services (Video Platform), short form clips (Short Video), visual discovery platforms (Photo Platform), and social networking feeds (Social Platform). If you paste a direct file URL like a .mp4, we bypass host checks and fetch it immediately."
    },
    {
      question: "How is my privacy protected?",
      answer: "We are deeply committed to user security and privacy. FlexDL never asks for emails, logins, or IP tracking. All data is processed on the fly using TLS. We do not store, catalog, or archive downloaded files on our servers — your actions remain fully anonymous."
    }
  ];

  return (
    <section id="faq" className="relative py-12 md:py-16 max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-3 justify-center mb-8">
        <div className="w-9 h-9 rounded-lg bg-brand/10 text-brand border border-brand/20 flex items-center justify-center">
          <HelpCircle className="w-5 h-5" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="glassmorphism rounded-2xl p-6 md:p-8">
        {faqItems.map((item, idx) => (
          <FaqRow
            key={idx}
            item={item}
            isOpen={openIndex === idx}
            onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}

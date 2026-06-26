/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Search, X, AlertCircle, Loader2, Sparkles, 
  Menu, ShieldCheck, Mail, Send, CheckCircle 
} from 'lucide-react';

import SeoMeta from './components/SeoMeta';
import AdPlaceholder from './components/AdPlaceholder';
import DownloadCard from './components/DownloadCard';
import FaqSection from './components/FaqSection';
import { VideoMetadata } from './types';

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);

  // Footer / Compliance Modals State
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Simple Contact form state
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Quick platform examples to make testing incredibly fun and fast with real public media paths!
  const platformExamples = [
    { name: 'Sample Video 1', example: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { name: 'Sample Video 2', example: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
    { name: 'Sample Video 3', example: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { name: 'Sample Audio Track', example: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }
  ];

  const handleExampleClick = (exampleUrl: string) => {
    setUrl(exampleUrl);
    triggerParsing(exampleUrl);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerParsing(url);
  };

  const triggerParsing = async (targetUrl: string) => {
    const trimmed = targetUrl.trim();
    if (!trimmed) {
      setError('Please paste a video link or file URL first.');
      setMetadata(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setMetadata(null);

    try {
      const response = await fetch('/api/download/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Parsing failed. Please verify the URL structure.');
      }

      setMetadata(data);
    } catch (err: any) {
      setError(err.message || 'Failed to establish stable stream parse connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setEmail('');
      setMessage('');
      setIsContactOpen(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col justify-between selection:bg-brand/30 selection:text-white">
      {/* Dynamic dynamic head tag injector */}
      <SeoMeta />

      {/* Top Header Section */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => { setUrl(''); setMetadata(null); setError(null); }}>
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
              onClick={() => setIsContactOpen(true)}
              className="px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold hover:bg-brand/20 hover:text-white transition-all duration-300"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      {/* Main Page Layout */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 md:py-8">
        {/* Ads Banner Container - Top */}
        <AdPlaceholder position="top-banner" id="ad-top" />

        {/* Hero Section */}
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

        {/* Input Bar Section */}
        <div className="max-w-3xl mx-auto mb-4 relative z-20">
          <motion.form 
            onSubmit={handleFormSubmit}
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
                  className="p-1 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 shrink-0 mr-1 transition-all"
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
              className="h-11 md:h-12 px-6 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs md:text-sm font-bold shadow-lg shadow-brand/10 hover:shadow-brand/20 active:scale-98 transition-all shrink-0 flex items-center justify-center gap-1.5 select-none"
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

          {/* Quick Examples Badges */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] font-bold text-neutral-500 mr-0.5 select-none uppercase tracking-wider">
              Quick Test:
            </span>
            {platformExamples.map((platform, idx) => (
              <button
                key={idx}
                id={`btn-sample-${idx}`}
                onClick={() => handleExampleClick(platform.example)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-950 border border-neutral-900/60 text-neutral-400 hover:text-purple-400 hover:border-brand/30 hover:bg-purple-950/10 transition-all duration-300"
              >
                {platform.name}
              </button>
            ))}
          </div>

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

        {/* Ads Banner Container - Below Hero */}
        <AdPlaceholder position="below-hero" id="ad-hero" />

        {/* Results / Error Display Area */}
        <div className="my-6 md:my-8">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-md mx-auto text-center py-8 glassmorphism rounded-2xl p-6 flex flex-col items-center justify-center border-purple-950/20 shadow-xl"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-brand/20 flex items-center justify-center text-brand animate-spin mb-3 shadow-lg shadow-purple-950/10">
                  <Loader2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">Processing Media Streams...</h3>
                <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
                  FlexDL is contacting the content source and extracting high-fidelity media containers.
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-lg mx-auto bg-red-950/15 border border-red-900/30 rounded-2xl p-4 flex items-start gap-3.5 shadow-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-red-900/20 text-red-400 border border-red-900/30 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-red-200">Extraction Error</h3>
                  <p className="text-[11px] text-red-400 mt-0.5 leading-relaxed">{error}</p>
                  <p className="text-[10px] text-neutral-500 mt-2 font-medium">
                    Tip: Verify your link is active, or click one of our "Quick Test" templates above.
                  </p>
                </div>
              </motion.div>
            )}

            {metadata && (
              <DownloadCard metadata={metadata} />
            )}
          </AnimatePresence>
        </div>

        {/* Center Single Column Layout for FAQ & Ads */}
        <div className="max-w-4xl mx-auto space-y-8 mt-8">
          {/* Ads Banner Container - Between sections */}
          <AdPlaceholder position="between-sections" id="ad-mid" />

          {/* FAQ section */}
          <FaqSection />
        </div>

        {/* Ads Banner Container - Bottom */}
        <AdPlaceholder position="bottom-banner" id="ad-bottom" />
      </main>

      {/* Footer Section */}
      <footer className="bg-black border-t border-neutral-900/80 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand and Copy */}
          <div className="text-center md:text-left">
            <span className="font-extrabold text-sm text-white tracking-tight">
              Flex<span className="text-brand">DL</span>
            </span>
            <p className="text-xs text-neutral-500 mt-1">
              &copy; 2026 FlexDL. Built with 100% cloud privacy.
            </p>
          </div>

          {/* Legal / Contact buttons list */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <button 
              onClick={() => setIsTermsOpen(true)}
              className="hover:text-purple-400 transition-colors duration-200"
            >
              Terms of Service
            </button>
            <button 
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-purple-400 transition-colors duration-200"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => setIsContactOpen(true)}
              className="hover:text-purple-400 transition-colors duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>
      </footer>

      {/* COMPLIANCE OVERLAY MODAL: Terms of Service */}
      <AnimatePresence>
        {isTermsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTermsOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 glassmorphism w-full max-w-xl max-h-[80vh] overflow-y-auto rounded-2xl p-6 md:p-8"
            >
              <button 
                onClick={() => setIsTermsOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-lg font-bold text-white tracking-tight mb-4 border-b border-neutral-900 pb-3">
                Terms of Service
              </h2>

              <div className="text-xs text-neutral-400 leading-relaxed space-y-4 font-normal">
                <p><strong>1. Acceptance of Terms:</strong> By accessing and using FlexDL, you agree to comply with and be bound by these simple terms of service.</p>
                <p><strong>2. Authorized Usage Only:</strong> You agree to use FlexDL exclusively for downloading public multimedia clips which you own, or for which you possess explicit authorization from the respective copyright owner. Users assume sole responsibility for all copyright compliance.</p>
                <p><strong>3. Intellectual Property Disclaimer:</strong> FlexDL is a neutral cloud parsing interface and does not compile, duplicate, store, or index database records. All trademark names, brand badges, and service logos are property of their respective holders.</p>
                <p><strong>4. Disclaimer of Warranties:</strong> The system is provided on an 'as-is' basis. We disclaim all implied or express warranties of availability or up-time consistency.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLIANCE OVERLAY MODAL: Privacy Policy */}
      <AnimatePresence>
        {isPrivacyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 glassmorphism w-full max-w-xl max-h-[80vh] overflow-y-auto rounded-2xl p-6 md:p-8"
            >
              <button 
                onClick={() => setIsPrivacyOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-lg font-bold text-white tracking-tight mb-4 border-b border-neutral-900 pb-3">
                Privacy Policy
              </h2>

              <div className="text-xs text-neutral-400 leading-relaxed space-y-4 font-normal">
                <p><strong>1. No Data Retention Policy:</strong> Our primary directive is full user privacy. FlexDL does not collect, record, or store any personal credentials, IP logs, or converted media files.</p>
                <p><strong>2. Immediate Transient Processing:</strong> Converted media formats are parsed on the fly and streamed directly from our server to your local browser download storage, bypassing database persistence layers entirely.</p>
                <p><strong>3. Use of Cookies:</strong> We do not track cookies for building individual personal profiles. Ad partners may configure standard cookies exclusively for banner representation safety.</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPLIANCE OVERLAY MODAL: Contact Support Form */}
      <AnimatePresence>
        {isContactOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 glassmorphism w-full max-w-md rounded-2xl p-6 md:p-8"
            >
              <button 
                onClick={() => setIsContactOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-neutral-900 pb-3">
                <Mail className="w-5 h-5 text-purple-400 animate-pulse" />
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Contact Support
                </h2>
              </div>

              {contactSuccess ? (
                <div className="py-6 text-center">
                  <CheckCircle className="w-12 h-12 text-teal-400 mx-auto mb-3 animate-bounce" />
                  <p className="text-sm font-semibold text-white">Message Transmitted!</p>
                  <p className="text-xs text-neutral-400 mt-1">Our support team will respond within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">
                      Your Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full h-11 bg-neutral-950 border border-neutral-900 rounded-xl px-3 text-sm text-white focus:outline-none focus:border-brand transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-msg" className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1.5">
                      Description of issue
                    </label>
                    <textarea
                      id="contact-msg"
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide URL and format issue description here..."
                      className="w-full bg-neutral-950 border border-neutral-900 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-contact-submit"
                    className="w-full h-11 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl shadow-md shadow-brand/10 hover:shadow-brand/20 transition-all flex items-center justify-center gap-2 select-none"
                  >
                    Transmit Message
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

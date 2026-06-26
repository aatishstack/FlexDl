/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Loader2, X, Mail, CheckCircle, Send } from 'lucide-react';

import SeoMeta from './components/SeoMeta';
import AdPlaceholder from './components/AdPlaceholder';
import DownloadCard from './components/DownloadCard';
import FaqSection from './components/FaqSection';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DownloadForm from './components/DownloadForm';
import Footer from './components/Footer';
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

  // Contact support state
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

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

  const resetAllState = () => {
    setUrl('');
    setMetadata(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col justify-between selection:bg-brand/30 selection:text-white">
      {/* Dynamic dynamic head tag injector */}
      <SeoMeta />

      {/* Top Header Section */}
      <Navbar 
        onBrandClick={resetAllState} 
        onContactClick={() => setIsContactOpen(true)} 
      />

      {/* Main Page Layout */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 md:py-8">
        {/* Ads Banner Container - Top */}
        <AdPlaceholder position="top-banner" id="ad-top" />

        {/* Hero Section */}
        <Hero />

        {/* Input Bar Section */}
        <DownloadForm 
          url={url}
          setUrl={setUrl}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />

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
                    Tip: Verify your link is active and public.
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
      <Footer 
        onTermsClick={() => setIsTermsOpen(true)}
        onPrivacyClick={() => setIsPrivacyOpen(true)}
        onContactClick={() => setIsContactOpen(true)}
      />

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
              className="absolute inset-0 bg-black cursor-pointer"
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
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
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
              className="absolute inset-0 bg-black cursor-pointer"
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
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
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
              className="absolute inset-0 bg-black cursor-pointer"
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
                className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900 cursor-pointer"
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
                    className="w-full h-11 bg-brand hover:bg-brand-hover text-white text-sm font-bold rounded-xl shadow-md shadow-brand/10 hover:shadow-brand/20 transition-all flex items-center justify-center gap-2 select-none cursor-pointer"
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

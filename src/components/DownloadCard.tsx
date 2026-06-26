/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Video, Music, Download, CheckCircle, Clock, ExternalLink, Loader2 } from 'lucide-react';
import { VideoMetadata, VideoFormat } from '../types';

interface DownloadCardProps {
  metadata: VideoMetadata;
  id?: string;
}

export default function DownloadCard({ metadata, id = "download-card" }: DownloadCardProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  const getPlatformDetails = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return { name: 'Video Platform', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
      case 'tiktok':
        return { name: 'Short Video', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
      case 'instagram':
        return { name: 'Photo Platform', color: 'bg-pink-500/10 text-pink-400 border-pink-500/20' };
      case 'twitter':
        return { name: 'Social Platform', color: 'bg-neutral-800 text-neutral-300 border-neutral-700' };
      default:
        return { name: 'Direct File Source', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
    }
  };

  const platformInfo = getPlatformDetails(metadata.platform);

  const handleDownload = (format: VideoFormat) => {
    if (downloadingId) return;

    setDownloadingId(format.id);
    setDownloadStatus('Initiating download stream...');

    // Trigger the real file streaming endpoint
    // This allows browser download manager to grab it natively without blocking the page
    window.location.href = format.downloadUrl;

    // Wait a brief period then clear downloading state
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadStatus('');
    }, 2000);
  };

  const videoFormats = metadata.formats.filter(f => f.type === 'video');
  const audioFormats = metadata.formats.filter(f => f.type === 'audio');

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glassmorphism rounded-2xl p-6 md:p-8 max-w-4xl mx-auto w-full relative z-10 overflow-hidden"
    >
      {/* Background radial accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-radial-[circle_at_center,rgba(124,58,237,0.06)_0%,transparent_70%] pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Left Side: Thumbnail Preview */}
        <div className="w-full md:w-2/5 shrink-0">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-900 group">
            <img
              src={metadata.thumbnail}
              alt={metadata.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Play overlay button */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-brand/90 flex items-center justify-center text-white shadow-lg shadow-brand/20">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>
            
            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-semibold text-neutral-300 border border-neutral-800/50 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              {metadata.duration}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5 items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${platformInfo.color}`}>
              {platformInfo.name}
            </span>
            <a 
              href={metadata.sourceUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-neutral-400 hover:text-purple-400 flex items-center gap-1 transition-colors duration-200"
            >
              Original URL <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right Side: Media Details & Formats */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight line-clamp-2">
              {metadata.title}
            </h2>
          </div>

          {/* Formats Selector */}
          <div className="mt-6 space-y-6">
            {/* Video Formats list */}
            {videoFormats.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400/80 mb-3 flex items-center gap-2">
                  <Video className="w-3.5 h-3.5" /> Video Formats
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {videoFormats.map((format) => {
                    const isCurrentDownloading = downloadingId === format.id;
                    return (
                      <button
                        key={format.id}
                        id={`btn-download-${format.id}`}
                        disabled={downloadingId !== null}
                        onClick={() => handleDownload(format)}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 relative overflow-hidden ${
                          isCurrentDownloading
                            ? 'bg-purple-950/20 border-brand text-white shadow-md shadow-brand/10'
                            : downloadingId !== null
                            ? 'bg-neutral-950/20 border-neutral-900/40 text-neutral-600 cursor-not-allowed'
                            : 'bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:border-brand/40 hover:bg-neutral-950/80 hover:text-white'
                        }`}
                      >
                        <div className="relative z-10 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCurrentDownloading ? 'bg-brand/20 text-brand' : 'bg-neutral-900 text-neutral-400'
                          }`}>
                            <Video className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{format.quality}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">Format: {format.ext.toUpperCase()} • Size: {format.size}</p>
                          </div>
                        </div>

                        <div className="relative z-10">
                          {isCurrentDownloading ? (
                            <span className="text-xs font-mono font-semibold text-purple-400">Downloading...</span>
                          ) : (
                            <Download className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Audio Formats list */}
            {audioFormats.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400/80 mb-3 flex items-center gap-2">
                  <Music className="w-3.5 h-3.5" /> Audio Extracts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {audioFormats.map((format) => {
                    const isCurrentDownloading = downloadingId === format.id;
                    return (
                      <button
                        key={format.id}
                        id={`btn-download-${format.id}`}
                        disabled={downloadingId !== null}
                        onClick={() => handleDownload(format)}
                        className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 relative overflow-hidden ${
                          isCurrentDownloading
                            ? 'bg-purple-950/20 border-brand text-white shadow-md shadow-brand/10'
                            : downloadingId !== null
                            ? 'bg-neutral-950/20 border-neutral-900/40 text-neutral-600 cursor-not-allowed'
                            : 'bg-neutral-950/60 border-neutral-900 text-neutral-300 hover:border-brand/40 hover:bg-neutral-950/80 hover:text-white'
                        }`}
                      >
                        <div className="relative z-10 flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            isCurrentDownloading ? 'bg-brand/20 text-brand' : 'bg-neutral-900 text-neutral-400'
                          }`}>
                            <Music className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{format.quality}</p>
                            <p className="text-[10px] text-neutral-500 font-mono">Format: {format.ext.toUpperCase()} • Size: {format.size}</p>
                          </div>
                        </div>

                        <div className="relative z-10">
                          {isCurrentDownloading ? (
                            <span className="text-xs font-mono font-semibold text-purple-400">Downloading...</span>
                          ) : (
                            <Download className="w-4 h-4 text-neutral-500 group-hover:text-purple-400 transition-colors" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Download Stream Feedback Status Overlay bar */}
          {downloadingId && (
            <div className="mt-6 bg-purple-950/30 border border-brand/20 rounded-xl p-3 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-200 truncate">{downloadStatus}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

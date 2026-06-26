/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VideoFormat {
  id: string;
  quality: string;
  ext: string;
  size: string;
  type: 'video' | 'audio';
  downloadUrl: string;
}

export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
  sourceUrl: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'twitter' | 'generic';
  formats: VideoFormat[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ApiErrorResponse {
  error: string;
  details?: string;
}

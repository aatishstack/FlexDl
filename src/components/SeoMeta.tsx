/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';

export default function SeoMeta() {
  useEffect(() => {
    // 1. Set basic document titles and descriptions
    document.title = "FlexDL - Fast Video Downloader & Media Extractor";

    // Helper function to upsert meta tags
    const setMetaTag = (attributeName: string, attributeValue: string, contentValue: string) => {
      let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attributeName, attributeValue);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', contentValue);
    };

    // Helper function to upsert canonical links
    const setCanonicalLink = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    };

    // 2. Set Standard Meta Tags
    setMetaTag('name', 'description', 'Download public videos and extract high-quality audio files from popular supported streaming sources with FlexDL. Clean, fast, and completely free.');
    setMetaTag('name', 'keywords', 'video downloader, download mp4, extract audio, mp3 audio converter, fast video download, secure downloader, tiktok downloader, youtube audio download, instagram reel download');
    setMetaTag('name', 'robots', 'index, follow');

    // 3. Set OpenGraph Meta Tags
    setMetaTag('property', 'og:type', 'website');
    setMetaTag('property', 'og:title', 'FlexDL - Fast Video Downloader & Media Extractor');
    setMetaTag('property', 'og:description', 'Download public videos and extract high-quality audio files from popular supported sources with a clean, fast experience.');
    setMetaTag('property', 'og:url', 'https://flexdl.co/');
    setMetaTag('property', 'og:site_name', 'FlexDL');
    setMetaTag('property', 'og:image', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80');

    // 4. Set Twitter Cards Meta Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', 'FlexDL - Fast Video Downloader & Media Extractor');
    setMetaTag('name', 'twitter:description', 'Download public videos and extract high-quality audio files from popular supported sources with a clean, fast experience.');
    setMetaTag('name', 'twitter:image', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80');

    // 5. Set Canonical URL
    setCanonicalLink('https://flexdl.co/');

    // 6. Inject Schema.org JSON-LD Structured Data
    const jsonLdData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "FlexDL",
      "alternateName": "Flex Video Downloader",
      "url": "https://flexdl.co/",
      "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "description": "Download videos from supported public sources with a clean, fast experience.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    let script = document.getElementById('json-ld-schema') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'json-ld-schema';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLdData);

    return () => {
      // Clean up script on unmount to keep DOM clean
      script.remove();
    };
  }, []);

  return null; // This component operates invisibly in the DOM head
}

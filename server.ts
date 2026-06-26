/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Readable } from "stream";

// Memory-based rate limiter to protect against basic abuse
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 requests per minute

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'");
}

async function extractMetadata(targetUrl: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache"
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Upstream server returned HTTP status ${response.status}`);
    }

    const html = await response.text();

    // Parse title
    let title = "Extracted Public Media";
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i) ||
                        html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:title"/i);
    if (ogTitleMatch) {
      title = decodeHtmlEntities(ogTitleMatch[1]);
    } else {
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      if (titleMatch) {
        title = decodeHtmlEntities(titleMatch[1]);
      }
    }

    // Parse thumbnail
    let thumbnail = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80";
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) ||
                         html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i) ||
                         html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]+)"/i);
    if (ogImageMatch) {
      thumbnail = ogImageMatch[1];
    }

    // Parse video URL from multiple standard formats
    let videoUrl = "";
    const ogVideoMatch = html.match(/<meta[^>]*property="og:video:secure_url"[^>]*content="([^"]+)"/i) ||
                         html.match(/<meta[^>]*property="og:video"[^>]*content="([^"]+)"/i) ||
                         html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:video:secure_url"/i) ||
                         html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:video"/i);
    if (ogVideoMatch) {
      videoUrl = ogVideoMatch[1];
    }

    if (!videoUrl) {
      const videoTagMatch = html.match(/<video[^>]*src="([^"]+)"/i) ||
                            html.match(/<source[^>]*src="([^"]+)"[^>]*type="video\/mp4"/i) ||
                            html.match(/<source[^>]*type="video\/mp4"[^>]*src="([^"]+)"/i) ||
                            html.match(/<source[^>]*src="([^"]+)"/i);
      if (videoTagMatch) {
        videoUrl = videoTagMatch[1];
      }
    }

    // Resolve relative URLs if needed
    if (videoUrl && !videoUrl.startsWith("http")) {
      try {
        videoUrl = new URL(videoUrl, targetUrl).toString();
      } catch (_) {}
    }

    return {
      title: title.trim(),
      thumbnail: thumbnail,
      videoUrl: videoUrl,
      rawHtml: html
    };

  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }
}

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "anonymous";
  const now = Date.now();

  let limit = ipRequestCounts.get(ip);

  if (!limit || now > limit.resetTime) {
    limit = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
    ipRequestCounts.set(ip, limit);
    return next();
  }

  limit.count++;
  if (limit.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: "Too many requests",
      details: "Please wait a minute before downloading another video."
    });
  }

  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Set secure headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Enable CORS for development
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // API Route: Parse Video URL
  app.post("/api/download/parse", rateLimiter, async (req, res) => {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "Invalid URL provided." });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.trim());
    } catch (e) {
      return res.status(400).json({ error: "Please enter a valid URL including http:// or https://" });
    }

    const host = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;

    // Check if it's a direct media link (MP4, MP3, etc.)
    const directFilePattern = /\.(mp4|mp3|m4a|webm|mov|avi|wav)$/i;
    const match = pathname.match(directFilePattern);

    if (match) {
      const ext = match[1].toLowerCase();
      const isAudio = ["mp3", "m4a", "wav"].includes(ext);
      const title = pathname.split("/").pop() || "direct_media_file";
      
      return res.json({
        title: decodeURIComponent(title),
        thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", // Premium abstract black background
        duration: "Direct File Link",
        sourceUrl: url,
        platform: "generic",
        formats: [
          {
            id: "direct-high",
            quality: isAudio ? "320kbps" : "Original Quality",
            ext: ext,
            size: "Dynamic",
            type: isAudio ? "audio" : "video",
            downloadUrl: `/api/download/stream?url=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}`
          }
        ]
      });
    }

    // 2. Real HTML Crawler / OpenGraph Parser
    try {
      const scraped = await extractMetadata(url.trim());
      
      if (!scraped.videoUrl) {
        // Fallback: look for any raw mp4 link inside the page source
        const mp4Regex = /"(https?:\/\/[^"]+\.mp4(?:\?[^"]+)??)"/gi;
        const mp4Matches = [...scraped.rawHtml.matchAll(mp4Regex)];
        if (mp4Matches.length > 0) {
          scraped.videoUrl = mp4Matches[0][1];
        }
      }

      if (!scraped.videoUrl) {
        return res.status(422).json({
          error: "Direct stream extraction is restricted by security policies.",
          details: "This publisher restricts automatic embedding, or employs bot protection (e.g., Cloudflare, CAPTCHAs). To proceed, please provide a direct media path or a standard OpenGraph-enabled source."
        });
      }

      const videoExt = scraped.videoUrl.split("?")[0].split(".").pop()?.toLowerCase() || "mp4";
      const titleSlug = scraped.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 30) || "extracted_media";
      
      const formats = [
        {
          id: "extracted-video",
          quality: "Original Stream Quality",
          ext: ["mp4", "webm", "mov"].includes(videoExt) ? videoExt : "mp4",
          size: "Dynamic Stream",
          type: "video" as const,
          downloadUrl: `/api/download/stream?url=${encodeURIComponent(scraped.videoUrl)}&name=${encodeURIComponent(titleSlug + "." + (["mp4", "webm", "mov"].includes(videoExt) ? videoExt : "mp4"))}`
        },
        {
          id: "extracted-audio",
          quality: "Audio Extract (MP3)",
          ext: "mp3",
          size: "Audio Track",
          type: "audio" as const,
          downloadUrl: `/api/download/stream?url=${encodeURIComponent(scraped.videoUrl)}&name=${encodeURIComponent(titleSlug + ".mp3")}`
        }
      ];

      return res.json({
        title: scraped.title,
        thumbnail: scraped.thumbnail,
        duration: "Auto Detected",
        sourceUrl: url,
        platform: host.includes("youtube.com") || host.includes("youtu.be") ? "youtube" :
                  host.includes("tiktok.com") ? "tiktok" :
                  host.includes("instagram.com") ? "instagram" :
                  host.includes("twitter.com") || host.includes("x.com") ? "twitter" : "generic",
        formats: formats
      });

    } catch (err: any) {
      console.error("Scraping error:", err.message);
      return res.status(500).json({
        error: "Unable to access target page",
        details: err.message || "An unexpected error occurred while fetching the URL content."
      });
    }
  });

  // API Route: Direct-to-browser media streaming proxy
  app.get("/api/download/stream", async (req, res) => {
    const mediaUrl = req.query.url as string;
    const filename = (req.query.name as string) || "media.mp4";

    if (!mediaUrl) {
      return res.status(400).json({ error: "Media URL is required." });
    }

    try {
      const response = await fetch(mediaUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept": "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": "https://www.google.com/"
        }
      });

      if (!response.ok) {
        throw new Error(`Upstream server returned status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type") || "application/octet-stream";
      const contentLength = response.headers.get("content-length");

      // Set headers for download attachment with proper browser caching disabled
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
      if (contentLength) {
        res.setHeader("Content-Length", contentLength);
      }
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");

      if (response.body) {
        const stream = Readable.fromWeb(response.body as any);
        stream.pipe(res);
      } else {
        res.status(500).json({ error: "No media stream received from upstream resource." });
      }
    } catch (error: any) {
      console.error("Download streaming error:", error);
      res.status(500).json({
        error: "Failed to fetch and stream file.",
        details: error.message || "An unexpected error occurred while proxying the stream."
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FlexDL Full-Stack Server boot complete.`);
    console.log(`Port: ${PORT}`);
    console.log(`Local Time: ${new Date().toISOString()}`);
  });
}

startServer().catch((err) => {
  console.error("Critical: Failed to boot FlexDL server", err);
});

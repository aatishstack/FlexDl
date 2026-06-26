# FlexDL - Premium Fast Video & Audio Downloader

FlexDL is a production-quality, high-speed public media extractor and downloader. Built with a stunning dark slate/absolute black visual concept, glassmorphism UI components, responsive typography, and full privacy compliance.

---

## 🛠️ Architecture Design

To maintain peak reliability, absolute compatibility with the container sandbox environment, and high-performance server-side capabilities, this solution utilizes a unified **Full-Stack Node/TypeScript Express + Vite Engine**:

*   **Frontend**: React (v19) powered by Vite (v6), Tailwind CSS (v4) with high-contrast customizable themes, Framer Motion for responsive UI transitions, and Lucide Icons.
*   **Backend**: Express (v4) server serving both as our production static-file web server and high-speed API parser/proxy stream router.
*   **Proxy Streaming Technology**: Built-in `/api/download/stream` endpoint on the server side which acts as a direct-to-browser media relay stream. This bypasses client-side browser CORS restrictions, allowing safe, fast media triggers directly inside the user's downloads folder.
*   **Simulated Meta Parsing**: Intelligent regex parser recognizing popular streaming links (YouTube, TikTok, Instagram, Twitter) and providing sample-file downloads, alongside support for direct video files.

---

## 🚀 Getting Started (Development Setup)

### 1. Install Dependencies
Run npm install to configure all packages:
```bash
npm install
```

### 2. Launch Local Development Server
Boot the Express + Vite server in TS mode:
```bash
npm run dev
```
The application will boot at `http://localhost:3000` with hot-reloading configurations, integrated APIs, and real media proxies fully active.

---

## 🏗️ Production Compiling & Distribution

To build for production, FlexDL uses a high-performance bundling configuration:

### 1. Build Client and Server bundles
```bash
npm run build
```
This script triggers two operations:
1.  **Vite Build**: Compiles standard optimized React frontend assets into static HTML/CSS/JS inside `/dist/`.
2.  **esbuild Server Bundle**: Packages the Express `/server.ts` into a self-contained CJS bundle `/dist/server.cjs`, resolving internal modules and compiling TypeScript with native sourcemaps.

### 2. Standalone Start Command
```bash
npm run start
```
Starts the bundled high-speed production server on port `3000` directly with clean filesystem I/O.

---

## 💎 Features & Custom Assets

*   **100% Privacy Compliance**: No database storage, IP logs, or cookies profiles tracked. Includes integrated footer modals detailing Terms of Service and Privacy Policy.
*   **AdSense Ready Slots**: Highly styled, responsive, non-obtrusive layout positions ready for quick Google AdSense integration.
*   **Optimized Search Crawling (SEO)**: Pre-configured `sitemap.xml`, `robots.txt`, dynamic OpenGraph property tags, and schema.org JSON-LD structured script injections.
*   **Quick-Load Testing Panels**: Native platform badges that pre-populate test URLs, allowing testers to instantly trigger loading animations and file-delivery mechanics in a single click.

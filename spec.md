# Sora Renderer – Product & Technical Specification

**Owner:** Marco  
**Target stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand (state), Dexie.js (IndexedDB), Web Workers, OpenAI JS SDK or signed `fetch`  
**Platforms:** Desktop-first web app (Chromium + Safari + Firefox latest)  
**Data residency:** 100% local (IndexedDB + in-browser Blobs). No backend.  
**Goal:** A slick, dark‑mode client that lets a user render Sora 2 (and Sora 2 Pro) videos from text and/or image input, estimate cost before rendering, and manage a local library of results.

---

## 1) Objectives & Scope

### 1.1 Primary objectives
- Input text prompt and optional reference image to create **video with synchronized audio** using Sora 2 / Sora 2 Pro.
- Let the user **paste/store their own OpenAI API key** locally (IndexedDB). No server storage.
- **Cost estimator** that computes expected price from model, resolution, and duration before submission.
- **Render queue** with job lifecycle (Queued → Running → Succeeded/Failed/Blocked → Archived).
- **Local media library** with thumbnails, basic metadata, open-in-new-tab, save-as (download), rename/move to local folders (via File System Access API when available), and delete.
- Support **all available formats/resolutions** exposed in pricing docs (portrait/landscape at 720p for sora-2 & pro; 1024×1792 / 1792×1024 for sora‑2‑pro) and any format gates the API allows.
- **Image+text** and **text-only** flows. (Future-friendly for ref video when available.)

### 1.2 Out of scope (V1)
- No cameo/likeness capture flow (app is API-only; cameo is Sora app feature). 
- No multi-user accounts / cloud sync. 
- No server proxy (user explicitly wants local-only). 
- No enterprise controls or team audit logs.

---

## 2) UX & IA

### 2.1 Visual system
- **Dark UI**; glassy cards, subtle noise/gradient, high contrast on inputs; content-first. 
- Typeface: System UI or Inter. 
- Motion: subtle page transitions; progress on tiles during render.

### 2.2 Information architecture
- **Top bar:** App title • Model selector • New Render • Library • Settings. 
- **Panels:**
  - **New Render** (default): Prompt editor, model/resolution/duration controls, cost estimate, input asset drop-zone, Advanced params drawer.
  - **Render Queue**: Jobs with status, ETA, cancel, retry.
  - **Library**: Grid of finished clips with filter (model, aspect, date), search, multi-select actions (download, delete, move).
  - **Settings**: API key vault, privacy tooltips, storage usage, export/import app data (encrypted JSON), reset.

### 2.3 Key flows
1) **First-run** → Welcome modal → paste API key → locally stored → New Render.
2) **Compose** → enter prompt + (optional) image → choose model/resolution/duration → estimate cost → Submit → job shows in Queue → background polling → on success, Library item appears with poster + play.
3) **Manage Library** → hover actions: Play, Open (detail), Download, Rename, Delete. Multi-select for bulk.

---

## 3) Requirements

### 3.1 Functional
- Paste API key; validate with a lightweight authenticated request (or a mock validation call) and store in IndexedDB (encrypted at rest using WebCrypto + app‑secret derived key). 
- Create video jobs: text-only or image+text. 
- Accept **resolution/format** combos supported by the API pricing page (720×1280, 1280×720 for sora‑2 & sora‑2‑pro; 1024×1792, 1792×1024 for sora‑2‑pro).
- Adjustable **duration** (respecting API max). UI caps at the documented max; guardrail client-side.
- Cost estimator: live updates as model/resolution/duration changes. 
- Job poller (Web Worker) that tracks status and fetches asset URLs/blobs when complete. 
- Local blob store (IndexedDB) of generated MP4/WebM (whatever API returns), with derived poster JPG/WEBP thumbnails. 
- Library operations: rename, tag, delete, export file(s) via `navigator.clipboard.write` (file copy on supported browsers) or `showSaveFilePicker`. 
- Import/export app data bundle (.json + referenced files as DataURLs or a zip) for migration to another device.

### 3.2 Non-functional
- **Privacy-first**: all secrets and assets local. 
- **Resilience**: recover queue on refresh (persist job state). 
- **Performance**: library virtualized grid; thumbnails pre-generated with OffscreenCanvas. 
- **Accessibility**: WCAG 2.2 AA (focus outlines, reduced motion option, captions placeholder for future).

---

## 4) Architecture

### 4.1 High level
- **Pure SPA inside Next.js (app router)**; all API calls from client. 
- **State**: Zustand store (app/global) + React Query for job fetch/poll. 
- **Persistence**: Dexie (IndexedDB) with Crypto wrapper for secrets; Blobs for media. 
- **Workers**: one **Polling Worker** managing job status & downloads; one **Thumbnail Worker** to extract first frame.

### 4.2 Modules
- `lib/openai.ts`: SDK or `fetch` wrapper. Injects API key from KeyVault, attaches headers, handles retries/backoff.
- `lib/cost.ts`: pricing table + calculator (per‑sec × duration). 
- `lib/db.ts`: Dexie schema, migrations, encryption helpers. 
- `workers/poller.ts`: exponential backoff polling; posts messages to main thread to update job state and persist assets.
- `workers/thumbs.ts`: draws first frame to canvas → blob thumbnail; stores in DB.
- UI feature folders under `app/(routes)`.

### 4.3 Security notes (client-only)
- Warn the user: **Any browser app that holds an API key is at risk** if the device is compromised. Include a toggle to **mask key** in UI and a one‑click **wipe key**. 
- Use `dangerouslyAllowBrowser: true` when using the OpenAI SDK; otherwise perform raw `fetch`. 
- Optional (advanced): allow **temporary session keys** (user pastes a short‑lived proxy token they minted elsewhere) while still keeping files local.

---

## 5) Data Model (IndexedDB via Dexie)

```ts
// DB name: "sora-renderer"
// Version: 1

export type ModelId = 'sora-2' | 'sora-2-pro';
export type Orientation = 'landscape' | 'portrait';
export type Resolution = '1280x720' | '720x1280' | '1792x1024' | '1024x1792';
export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed' | 'blocked' | 'canceled';

export interface KeyVault {
  id: 'openai';
  encKey: ArrayBuffer; // encrypted API key (AES-GCM)
  createdAt: number;
}

export interface RenderJob {
  id: string; // uuid
  model: ModelId;
  resolution: Resolution;
  durationSec: number; // 1..max
  prompt: string;
  refImageId?: string; // FK to Asset.id
  costUsdEstimate: number;
  apiJobId?: string; // returned by OpenAI
  status: JobStatus;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Asset {
  id: string; // uuid
  kind: 'image' | 'video' | 'thumb';
  mime: string;
  name: string;
  bytes: number;
  blob: Blob; // stored via Dexie Blob support
  jobId?: string; // for outputs
  createdAt: number;
  meta?: Record<string, any>; // e.g., width, height, aspect
}

export interface Settings {
  id: 'app';
  theme: 'dark' | 'light' | 'system';
  pollingMs: number; // default 2500
  autoDownload: boolean; // also persist blob locally in FS Access
  showAdvanced: boolean;
}
```

Tables & indexes: 
- `keyvault` (PK: id) 
- `jobs` (PK: id, IDX: `status, createdAt`) 
- `assets` (PK: id, IDX: `kind, jobId`) 
- `settings` (PK: id)

---

## 6) API Integration Contract

> **Note:** This app integrates with OpenAI’s **Video Generation** API for Sora 2. The flow is: **Create job → Poll status → Retrieve file(s)**. 

### 6.1 Create video job (text-only)
```ts
// Pseudocode signature used by lib/openai.ts
async function createVideoJob(params: {
  model: ModelId; // 'sora-2' | 'sora-2-pro'
  prompt: string;
  resolution: Resolution; // e.g., '1280x720'
  duration: number; // seconds (UI guardrails to API max)
}) : Promise<{ jobId: string }>
```
**Request body (example):**
```json
{
  "model": "sora-2",
  "input": {
    "type": "video.generate",
    "prompt": "A slow cinematic push-in on a mossy forest floor at dawn, shallow DOF, mist, macro bokeh",
    "resolution": "1280x720",
    "duration": 10
  }
}
```
**Response:** `{ job_id: string, status: 'queued' }`

### 6.2 Create video job (image + text)
```json
{
  "model": "sora-2-pro",
  "input": {
    "type": "video.generate",
    "prompt": "Turn this still into a drifting parallax shot with rain ambience and subtle camera sway",
    "image": {
      "mime_type": "image/png",
      "data": "<base64>"
    },
    "resolution": "1792x1024",
    "duration": 8
  }
}
```

### 6.3 Get job status
```ts
async function getVideoJob(jobId: string): Promise<{
  status: JobStatus;
  assets?: Array<{ url: string; mime: string }>; // signed URLs
  error?: string;
}>;
```

### 6.4 Download outputs
- On `succeeded`, fetch the video file(s). Persist as Asset: `kind='video'` and generate a `thumb` via worker.

### 6.5 Errors & blocks
- Map common API errors to friendly UI messages (e.g., policy blocks, invalid params, rate limits). Mark job `blocked` when content policy rejects after generation; allow **Retry** (user edits prompt).

---

## 7) Cost Estimator

### 7.1 Pricing table (client constant)
```ts
const PRICE_TABLE = {
  'sora-2': {
    '1280x720': 0.10, // $/sec (landscape)
    '720x1280': 0.10  // $/sec (portrait)
  },
  'sora-2-pro': {
    '1280x720': 0.30,
    '720x1280': 0.30,
    '1792x1024': 0.50,
    '1024x1792': 0.50
  }
} as const;

export function estimateCostUsd(model: ModelId, res: Resolution, seconds: number) {
  const rate = PRICE_TABLE[model]?.[res] ?? 0;
  const cost = +(rate * seconds).toFixed(2);
  return { rate, seconds, cost };
}
```

### 7.2 UI behavior
- Estimator recalculates live with 
  - model (`sora-2` vs `sora-2-pro`)
  - resolution (`1280×720`, `720×1280`, `1792×1024`, `1024×1792`)
  - duration (1..max). 
- Display **“Estimated: $X.XX (Y¢/sec)”** with a hover footnote explaining it’s based on official pricing and excludes re-tries or policy‑blocked refunds.

---

## 8) Settings & Storage

### 8.1 API key vault
- Encrypt API key using WebCrypto (AES‑GCM) with a key derived from a local, random app secret stored in IndexedDB. Offer **optional passphrase** to derive the key instead (user memorizes).
- Show masked value with one‑click reveal + copy to clipboard. 
- Buttons: **Validate Key**, **Wipe Key**, **Export Encrypted Bundle**, **Import Encrypted Bundle**.

### 8.2 Storage management
- Display total bytes by kind: images, videos, thumbs. 
- Provide cleanup tools: **Delete all thumbs (rebuild on demand)**, **Purge failed jobs**, **Hard‑reset app**.

---

## 9) Components (selected)
- `PromptEditor`: token counter, prompt tips (accordion), "use image" drop-zone. 
- `ModelPicker`: sora‑2 / sora‑2‑pro with descriptive badges and per‑sec price. 
- `ResolutionPicker`: grid buttons with aspect icons.
- `DurationSlider`: 1–20s (or API max) with type-in. 
- `CostBadge`: live estimate. 
- `QueueList`: cards with circular progress, status tags, cancel/retry.
- `LibraryGrid`: virtualized grid; each tile shows poster, length, model, res, date. 
- `AssetDetailDrawer`: video player, prompt, parameters, cost, actions (re-run with tweaks).

---

## 10) Background Jobs

### 10.1 Polling worker
- On job create, push to worker channel. 
- Worker polls `/jobs/{id}` every 2.5s with exp. backoff (2.5s → 5s → 7.5s → … up to 30s). 
- On `succeeded`, streams download to Blob; posts back `assetReady` with metadata; main thread persists.

### 10.2 Thumbnail worker
- Uses `HTMLVideoElement` + `canvas` (or `OffscreenCanvas`) to extract first frame after `loadeddata`.

---

## 11) Error Handling & Edge Cases
- **Policy blocks**: mark as `blocked`, surface reason, keep prompt so the user can edit. 
- **Network**: exponential retry on 5xx; immediate surface on 4xx with actionable text. 
- **Partial success / multiple assets**: if the API returns multiple variants or audio tracks, store all; prefer the main MP4 for preview.

---

## 12) Accessibility & Intl
- Keyboard reachable; `aria-live` regions for job status updates. 
- Color contrast ≥ 4.5:1; reduced‑motion respect. 
- i18n keys in code; English copy default. 

---

## 13) Testing Plan
- **Unit**: cost calculator, DB ops, key vault crypto, parameter validation. 
- **E2E**: first‑run (key add), text render, image+text render, cancel, retry, delete, export/import. 
- **Performance**: library with 200+ videos; scroll jank < 16ms/frame.

---

## 14) Build & Tooling
- Node 20+, PNPM. 
- Tailwind with dark theme tokens. 
- ESLint + Prettier + Type‑check CI (local). 

---

## 15) Legal & Safety Notes (UI copy)
- Short, clear tooltip before submission: user must have rights to any uploaded media; no public‑figure likenesses without consent; content policy blocks may incur cost even when output is restricted.

---

## 16) Roadmap Ideas (post‑V1)
- Batch rendering with parameter sweeps. 
- Prompt presets and reusable style packs. 
- Local-only captioning (Whisper on-device via WebAssembly) + waveform preview. 
- Basic cut/splice editor for quick social exports. 
- Optional **serverless proxy** pattern for safer key handling (still keep files local).

---

## 17) Deliverables
- Next.js app scaffold with pages: `/new`, `/queue`, `/library`, `/settings`. 
- TypeScript types for models, DB, API functions. 
- Two Web Workers (poller, thumbnail) + communication channel. 
- Dexie schema & migrations; encryption helpers. 
- Polished dark UI with Tailwind components and empty/error states.


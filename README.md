# Sora Renderer

A local-first, privacy-focused web application for generating videos using OpenAI's Sora 2 and Sora 2 Pro models.

**Create stunning AI videos directly in your browser with complete privacy and control.**

Sora Renderer is a modern web application that lets you generate videos using OpenAI's powerful Sora 2 models. Unlike cloud-based solutions, all your data—API keys, videos, and metadata—stays on your device. No servers, no tracking, no compromises.

## Features

- 🎬 **Video Generation**: Create videos from text prompts or text + image inputs
- 🔒 **Privacy First**: All data (API keys, videos, metadata) stored locally in your browser
- 💰 **Cost Estimator**: Real-time cost calculation before submitting jobs
- ⏳ **Job Queue**: Track rendering progress with automatic polling
- 📚 **Local Library**: Manage your generated videos with search and filters
- 🎨 **Dark UI**: Beautiful, modern interface with glass-morphism design
- ⚡ **Web Workers**: Background processing for polling and thumbnail generation

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Database**: Dexie.js (IndexedDB)
- **API**: OpenAI SDK
- **Data Fetching**: TanStack React Query

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- OpenAI API key with access to Sora 2

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheMarco/sora-renderer.git
cd sora-renderer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deploy to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy Sora Renderer. It's free for personal projects and takes just a few minutes.

#### Option 1: One-Click Deploy

Click this button to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TheMarco/sora-renderer)

This will:
1. Fork the repository to your GitHub account
2. Create a new Vercel project
3. Deploy the application automatically
4. Give you a live URL (e.g., `your-app.vercel.app`)

#### Option 2: Manual Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from your local repository
vercel
```

Follow the prompts to link your project and deploy.

#### Option 3: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click **"Deploy"**

#### Post-Deployment Setup

After deployment:

1. Visit your deployed URL
2. Click the **Settings** (⚙️) icon in the navigation
3. Enter your OpenAI API key
4. Start generating videos!

**Note**: Your API key is encrypted and stored only in your browser's local storage. It never touches Vercel's servers.

#### Vercel Configuration

No environment variables or build configuration needed! The app works out of the box on Vercel with:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Node Version**: 20.x (recommended)

See [DEPLOYMENT.md](DEPLOYMENT.md) for advanced deployment options and troubleshooting.

### First-Time Setup

1. On first launch, you'll see a welcome modal
2. Navigate to Settings (⚙️ icon in the top navigation)
3. Paste your OpenAI API key
4. The key will be encrypted and stored locally in your browser
5. Start creating videos!

## Usage

### Creating a Video

1. Go to **New Render**
2. Enter a detailed prompt describing your video
3. (Optional) Upload a reference image
4. Select model (Sora 2 or Sora 2 Pro)
5. Choose resolution and duration
6. Review the cost estimate
7. Click **Generate Video**

### Managing Jobs

- View active and completed jobs in the **Queue** page
- Cancel running jobs or retry failed ones
- Jobs are automatically polled for status updates

### Library

- All completed videos appear in the **Library**
- Search by prompt text
- Filter by model
- Download, view, or delete videos
- Videos are stored locally in IndexedDB

## Project Structure

```
sora-renderer/
├── app/                    # Next.js app directory
│   ├── new/               # New render page
│   ├── queue/             # Job queue page
│   ├── library/           # Video library page
│   └── settings/          # Settings page
├── components/            # React components
│   ├── render/           # Render-specific components
│   ├── Navigation.tsx    # Top navigation
│   ├── Modal.tsx         # Modal system
│   └── Toast.tsx         # Toast notifications
├── lib/                   # Core utilities
│   ├── db.ts             # Dexie database
│   ├── crypto.ts         # Encryption utilities
│   ├── openai.ts         # OpenAI API integration
│   ├── cost.ts           # Cost calculator
│   ├── store.ts          # Zustand store
│   └── hooks/            # Custom React hooks
└── workers/              # Web Workers
    ├── poller.ts         # Job polling worker
    └── thumbs.ts         # Thumbnail generation worker
```

## Security & Privacy

⚠️ **Important Security Notes:**

- Your API key is encrypted using AES-GCM and stored in IndexedDB
- All data stays on your device - nothing is sent to any server except direct API calls to OpenAI
- Browser-based encryption is vulnerable if your device is compromised
- Consider using short-lived API keys or proxy tokens for additional security

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Pricing

Sora 2 and Sora 2 Pro pricing (as of implementation):

| Model | Resolution | Price per Second |
|-------|-----------|------------------|
| Sora 2 | 1280×720 / 720×1280 | $0.10/sec |
| Sora 2 Pro | 1280×720 / 720×1280 | $0.30/sec |
| Sora 2 Pro | 1792×1024 / 1024×1792 | $0.50/sec |

## Limitations

- Maximum video duration: 12 seconds (OpenAI Sora 2 API limit)
- Browser storage limits apply (typically 50-100GB)
- No cloud sync or multi-device support
- No server-side processing

## Future Enhancements

- Batch rendering with parameter sweeps
- Prompt presets and style packs
- Local captioning with Whisper
- Basic video editing tools
- Optional serverless proxy for safer key handling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

Copyright (c) 2025 Marco van Hylckama Vlieg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Author

**Marco van Hylckama Vlieg**

- Website: [ai-created.com](https://ai-created.com/)
- X/Twitter: [@AIandDesign](https://x.com/AIandDesign)

## Acknowledgments

- Built for the OpenAI Sora 2 API
- Inspired by the need for local-first, privacy-focused tools
- Special thanks to the Next.js and React communities

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Note**: This is an unofficial client application. It is not affiliated with or endorsed by OpenAI.

# Sora Renderer

A local-first, privacy-focused web application for generating videos using OpenAI's Sora 2 and Sora 2 Pro models.

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

- Maximum video duration: 20 seconds
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

MIT License - see LICENSE file for details

## Acknowledgments

- Built for the OpenAI Sora 2 API
- Inspired by the need for local-first, privacy-focused tools
- Special thanks to the Next.js and React communities

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Note**: This is an unofficial client application. It is not affiliated with or endorsed by OpenAI.

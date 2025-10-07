'use client';

import { Navigation } from '@/components/Navigation';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">About Sora Renderer</h1>

        <div className="space-y-6">
          {/* About Section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">About This Tool</h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                Sora Renderer is a privacy-first, local-first web application for generating AI videos 
                using OpenAI&apos;s Sora 2 and Sora 2 Pro models. All your data stays in your browser - 
                no server storage, no tracking, complete privacy.
              </p>
              <p>
                This tool provides a clean, intuitive interface for creating videos with detailed 
                prompting guidance, automatic image resizing, real-time cost estimates, and a local 
                video library.
              </p>
            </div>
          </section>

          {/* Creator Section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Creator</h2>
            <div className="space-y-4">
              <p className="text-text-secondary">
                Created by <span className="text-text-primary font-medium">Marco van Hylckama Vlieg</span>
              </p>
              
              <div className="flex flex-col space-y-2">
                <a
                  href="https://ai-created.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center space-x-2"
                >
                  <span>🌐</span>
                  <span>Website: ai-created.com</span>
                </a>
                
                <a
                  href="https://x.com/AIandDesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center space-x-2"
                >
                  <span>𝕏</span>
                  <span>X/Twitter: @AIandDesign</span>
                </a>
                
                <a
                  href="https://github.com/TheMarco/sora-renderer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center space-x-2"
                >
                  <span>💻</span>
                  <span>Source Code: github.com/TheMarco/sora-renderer</span>
                </a>
              </div>
            </div>
          </section>

          {/* License Section */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">License</h2>
            <div className="space-y-4 text-text-secondary">
              <p>
                This project is released under the <span className="text-text-primary font-medium">MIT License</span>.
              </p>
              <p>
                You are free to use, modify, and distribute this software for personal or commercial 
                purposes. See the{' '}
                <a
                  href="https://github.com/TheMarco/sora-renderer/blob/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  LICENSE file
                </a>{' '}
                for full details.
              </p>
            </div>
          </section>

          {/* Terms of Service */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
            <div className="space-y-4 text-text-secondary text-sm">
              <p className="text-text-primary font-medium">
                By using Sora Renderer, you agree to the following terms:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="text-text-primary font-medium mb-2">1. No Warranty</h3>
                  <p>
                    This software is provided &quot;as is&quot;, without warranty of any kind, express or 
                    implied, including but not limited to the warranties of merchantability, fitness for 
                    a particular purpose, and noninfringement.
                  </p>
                </div>

                <div>
                  <h3 className="text-text-primary font-medium mb-2">2. Limitation of Liability</h3>
                  <p>
                    In no event shall the creator, Marco van Hylckama Vlieg, be liable for any claim, 
                    damages, or other liability, whether in an action of contract, tort, or otherwise, 
                    arising from, out of, or in connection with the software or the use or other dealings 
                    in the software.
                  </p>
                </div>

                <div>
                  <h3 className="text-text-primary font-medium mb-2">3. Financial Responsibility</h3>
                  <p>
                    You are solely responsible for all costs incurred through your use of this application, 
                    including but not limited to:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>OpenAI API charges and bills</li>
                    <li>Video generation costs</li>
                    <li>Any unexpected or excessive charges</li>
                    <li>Failed or blocked generations that still incur costs</li>
                  </ul>
                  <p className="mt-2">
                    The creator is not responsible for any financial damage, including high API bills, 
                    unexpected charges, or any other monetary losses resulting from the use of this tool.
                  </p>
                </div>

                <div>
                  <h3 className="text-text-primary font-medium mb-2">4. User Responsibility</h3>
                  <p>
                    You are responsible for:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Securing your OpenAI API key</li>
                    <li>Monitoring your API usage and costs</li>
                    <li>Complying with OpenAI&apos;s terms of service and usage policies</li>
                    <li>Ensuring you have rights to any media you upload</li>
                    <li>All content generated using this tool</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-text-primary font-medium mb-2">5. Third-Party Services</h3>
                  <p>
                    This application uses OpenAI&apos;s API services. You must comply with OpenAI&apos;s 
                    terms of service, usage policies, and content policies. The creator is not responsible 
                    for any issues arising from your use of OpenAI&apos;s services.
                  </p>
                </div>

                <div>
                  <h3 className="text-text-primary font-medium mb-2">6. Data and Privacy</h3>
                  <p>
                    While this application stores data locally in your browser and does not transmit data 
                    to any servers other than OpenAI&apos;s API, you are responsible for understanding and 
                    accepting the privacy implications of using OpenAI&apos;s services.
                  </p>
                </div>

                <div>
                  <h3 className="text-text-primary font-medium mb-2">7. No Guarantees</h3>
                  <p>
                    The creator makes no guarantees about:
                  </p>
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>Availability or uptime of the application</li>
                    <li>Quality or success of video generations</li>
                    <li>Compatibility with future API changes</li>
                    <li>Data persistence or backup</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-text-primary font-medium mb-2">8. Modifications</h3>
                  <p>
                    These terms may be updated at any time without notice. Continued use of the application 
                    constitutes acceptance of any changes.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-warning font-medium">
                  ⚠️ Important: By using this application, you acknowledge that you have read, understood, 
                  and agree to these terms. If you do not agree, please do not use this application.
                </p>
              </div>
            </div>
          </section>

          {/* Technology Stack */}
          <section className="glass-card p-6">
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <div className="space-y-2 text-text-secondary text-sm">
              <p>Built with modern web technologies:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Next.js 14 (App Router)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Dexie.js (IndexedDB)</li>
                <li>Web Crypto API</li>
                <li>OpenAI Sora 2 API</li>
              </ul>
            </div>
          </section>

          {/* Back to App */}
          <div className="flex justify-center pt-4">
            <Link href="/new" className="btn-primary">
              ← Back to App
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


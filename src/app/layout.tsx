import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { PwaRegister } from '@/components/layout/pwa-register';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeutschForge – Cognitive German Mastery',
  description: 'Personal CEFR A1→B2 German learning system with spaced repetition and Goethe exam preparation.',
  manifest: '/manifest.json',
  themeColor: '#007AFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DeutschForge',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen bg-[var(--bg-primary)] antialiased">
        <ThemeProvider>
          <PwaRegister />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
              {children}
            </main>
          </div>
          <MobileNav />
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'glass rounded-xl border-[var(--border)]',
              duration: 3000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

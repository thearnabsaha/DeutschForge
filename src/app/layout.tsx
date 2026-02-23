import type { Metadata, Viewport } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { PwaRegister } from '@/components/layout/pwa-register';
import { AuthProvider } from '@/components/auth/auth-guard';
import './globals.css';

export const metadata: Metadata = {
  title: 'DeutschForge – Cognitive German Mastery',
  description: 'Personal CEFR A1→B2 German learning system with spaced repetition and Goethe exam preparation.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#007AFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="bg-[var(--bg-primary)] antialiased" style={{ minHeight: '100dvh' }}>
        <ThemeProvider>
          <AuthProvider>
            <PwaRegister />
            <div className="flex" style={{ minHeight: '100dvh' }}>
              <Sidebar />
              <main className="main-scroll flex-1 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
                {children}
              </main>
            </div>
            <MobileNav />
          </AuthProvider>
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

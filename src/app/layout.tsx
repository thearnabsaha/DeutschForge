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
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DeutschForge',
  },
  applicationName: 'DeutschForge',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#58CC02',
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
            <div className="flex h-[100dvh]">
              <Sidebar />
              <main className="main-scroll flex-1 overflow-y-auto pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
                {children}
              </main>
            </div>
            <MobileNav />
          </AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'toast-custom rounded-xl',
              duration: 3000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

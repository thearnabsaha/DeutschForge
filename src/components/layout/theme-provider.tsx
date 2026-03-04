'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={['light', 'dark', 'system', 'high-contrast', 'minimal', 'colorful', 'dark-nord', 'dark-warm', 'amoled', 'dark-purple']}
    >
      {children}
    </NextThemesProvider>
  );
}

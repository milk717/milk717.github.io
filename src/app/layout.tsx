import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import './global.css';
import { Footer } from '@/components/footer';
import { Navigation } from '@/components/navigation';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Milk717 Blog',
  description: 'Milk717 블로그 입니다.',
};

const RootLayout: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="bg-sidebar">
        <ThemeProvider>
          <div className="relative max-w-4xl mx-auto p-4">
            <Navigation />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-K4QSH24CR7" />
    </html>
  );
};

export default RootLayout;

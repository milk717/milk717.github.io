import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import Navigation from '@/components/Navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

import './globals.css';

export const metadata: Metadata = {
  title: 'Milk717 Blog',
  description: 'Milk717 블로그 입니다.',
};

const RootLayout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <html lang="ko">
      <body className="relative bg-background p-4 max-w-4xl mx-auto">
        <Navigation />
        {children}
      </body>
      <GoogleAnalytics gaId="G-K4QSH24CR7" />
    </html>
  );
};

export default RootLayout;

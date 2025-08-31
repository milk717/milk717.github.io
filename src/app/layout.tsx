import type { Metadata } from 'next';
import type { PropsWithChildren } from "react";
import { GoogleAnalytics } from '@next/third-parties/google';

import './globals.css';
import { Navigation } from "@/components/navigation";

export const metadata: Metadata = {
  title: 'Milk717 Blog',
  description: 'Milk717 블로그 입니다.',
};

const RootLayout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <html lang="ko">
      <body className="bg-sidebar">
        <div className="relative max-w-4xl mx-auto p-4">
          <Navigation />
          {children}
        </div>
      </body>
      <GoogleAnalytics gaId="G-K4QSH24CR7" />
    </html>
  );
};

export default RootLayout;

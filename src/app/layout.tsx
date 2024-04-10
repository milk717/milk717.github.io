import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {PropsWithChildren} from 'react';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Milk717 Blog',
  description: 'Milk717 블로그 입니다.',
};

const RootLayout: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <html lang="ko">
      <body className="p-4 max-w-screen-lg mx-auto">{children}</body>
    </html>
  );
};

export default RootLayout;

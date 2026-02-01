'use client';

import { createRef, memo, useLayoutEffect } from 'react';

const UtterancesComments: React.FC = memo(function Comments() {
  const containerRef = createRef<HTMLDivElement>();
  useLayoutEffect(() => {
    const utterances = document.createElement('script');

    const attributes = {
      src: 'https://utteranc.es/client.js',
      repo: 'milk717/blog-comments',
      theme: 'github-light',
      'issue-term': 'pathname',
      label: '✨💬 comments ✨',
      crossOrigin: 'anonymous',
      async: 'true',
    };

    for (const [key, value] of Object.entries(attributes)) {
      utterances.setAttribute(key, value as string);
    }

    containerRef.current?.replaceChildren(utterances);
  }, [containerRef]);

  return <section id="utterance-comments" ref={containerRef} />;
});

export default UtterancesComments;

'use client';

import {createRef, memo, useLayoutEffect} from 'react';

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

    Object.entries(attributes).forEach(([key, value]) => {
      utterances.setAttribute(key, value);
    });

    containerRef.current?.replaceChildren(utterances);
  }, []);

  return <section id="utterance-comments" ref={containerRef} />;
});

export default UtterancesComments;

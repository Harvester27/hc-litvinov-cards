'use client';

import React, { useEffect, useState } from 'react';
import { createPlayerLinks } from '@/data/ArticleUtils';

export default function ArticleContent({ content }) {
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    // Zpracujeme obsah článku a přidáme odkazy na hráče
    const contentWithLinks = createPlayerLinks(content);
    setProcessedContent(contentWithLinks);
  }, [content]);

  return (
    <div 
      className="article-content prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: processedContent }}
      style={{
        // Vlastní styly pro články
        color: '#374151',
      }}
    />
  );
}
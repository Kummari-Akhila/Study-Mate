import React, { useState, useEffect } from 'react';

const LOADING_TIPS = [
  'Extracting key terms and technical vocabulary...',
  'Structuring definitions into flashcards...',
  'Generating multiple-choice quiz questions...',
  'Compiling custom learning explanations...',
  'Reviewing JSON format integrity to prevent errors...',
  'Optimizing answer key selections...'
];

export default function Loading() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % LOADING_TIPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-container glass-panel fade-in" style={{ margin: '4rem auto', maxWidth: '500px' }}>
      <div className="spinner" aria-label="Loading content"></div>
      <h3 style={{ marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>Processing with AI</h3>
      <p style={{ minHeight: '3rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
        {LOADING_TIPS[tipIndex]}
      </p>
    </div>
  );
}

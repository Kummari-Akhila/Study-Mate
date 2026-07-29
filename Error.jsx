import React from 'react';
import { AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';

export default function Error({ message, onRetry, onUseFallback }) {
  return (
    <div className="error-container fade-in" style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <div className="error-title">
        <AlertCircle size={20} className="text-error" style={{ color: 'var(--error)' }} />
        <span>Something went wrong with the AI response</span>
      </div>
      
      <p className="error-message">
        {message || 'The AI encountered an issue generating the structured learning format.'}
      </p>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '1rem', 
        marginTop: '0.5rem',
        borderTop: '1px solid rgba(244, 63, 94, 0.2)',
        paddingTop: '1.25rem'
      }}>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
        
        {onUseFallback && (
          <button onClick={onUseFallback} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            <HelpCircle size={16} />
            Load Sample Material
          </button>
        )}
      </div>
    </div>
  );
}

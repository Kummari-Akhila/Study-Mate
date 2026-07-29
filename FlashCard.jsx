import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

export default function FlashCard({ 
  card, 
  cardIndex, 
  totalCards, 
  onNext, 
  onPrev 
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Reset flip status when card index changes
  useEffect(() => {
    setIsFlipped(false);
  }, [cardIndex]);

  // Keyboard navigation listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  // Touch Swipe Gesture Handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 60; // minimum distance in px to count as swipe
    if (diff > threshold && onNext) {
      onNext();
    } else if (diff < -threshold && onPrev) {
      onPrev();
    }
  };

  if (!card) return null;

  return (
    <div className="fade-in">
      <div 
        className={`flashcard-wrapper ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${cardIndex + 1} of ${totalCards}. Question: ${card.question}. Press space to flip.`}
      >
        <div className="flashcard-inner">
          {/* FRONT */}
          <div className="flashcard-front">
            <span className="card-label">Front</span>
            <div className={`card-text ${card.question.length > 120 ? 'text-long' : ''}`}>
              {card.question}
            </div>
            <div className="card-hint flex-center" style={{ gap: '0.25rem' }}>
              <RotateCw size={14} /> Tap or press Space to reveal answer
            </div>
          </div>

          {/* BACK */}
          <div className="flashcard-back">
            <span className="card-label">Back</span>
            <div className={`card-text ${card.answer.length > 120 ? 'text-long' : ''}`} style={{ fontSize: card.answer.length > 120 ? undefined : '1.25rem' }}>
              {card.answer}
            </div>
            <div className="card-hint">Tap to flip back</div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="controls-container">
        <button 
          onClick={(e) => { e.stopPropagation(); onPrev(); }} 
          disabled={cardIndex === 0}
          className="btn btn-secondary"
          aria-label="Previous flashcard"
          style={{ padding: '0.6rem 1.1rem' }}
        >
          <ArrowLeft size={18} />
          <span>Prev</span>
        </button>

        <div className="progress-dots" style={{ alignItems: 'center', justifyContent: 'center' }}>
          {totalCards <= 15 ? (
            Array.from({ length: totalCards }).map((_, i) => (
              <div 
                key={i} 
                className={`dot ${i === cardIndex ? 'active' : ''}`} 
                onClick={(e) => { e.stopPropagation(); }}
              />
            ))
          ) : (
            <span style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {cardIndex + 1} / {totalCards}
            </span>
          )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); onNext(); }} 
          disabled={cardIndex === totalCards - 1}
          className="btn btn-secondary"
          aria-label="Next flashcard"
          style={{ padding: '0.6rem 1.1rem' }}
        >
          <span>Next</span>
          <ArrowRight size={18} />
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Tip: You can use Left/Right arrows to navigate and Space to flip cards. Swiping works on mobile!
      </div>
    </div>
  );
}

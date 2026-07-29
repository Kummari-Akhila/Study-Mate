import React, { useState } from 'react';
import { Check, X, ArrowRight, BookOpen } from 'lucide-react';

export default function Quiz({ questions, onCompleted }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});

  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No quiz questions available for this topic.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const { question, options, correctAnswerIndex, explanation } = currentQuestion;

  const handleOptionClick = (optionIdx) => {
    if (showFeedback) return; // Prevent changing answer after locking in
    setSelectedOption(optionIdx);
    setShowFeedback(true);
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIdx
    }));
  };

  const handleNextClick = () => {
    if (currentIndex < questions.length - 1) {
      setSelectedOption(null);
      setShowFeedback(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      // Build complete final answers map before completing
      const finalAnswers = { ...userAnswers };
      onCompleted(finalAnswers);
    }
  };

  return (
    <div className="glass-panel quiz-card fade-in">
      <div className="quiz-header">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span style={{ 
          fontSize: '0.8rem',
          background: 'rgba(255,255,255,0.05)',
          padding: '0.2rem 0.5rem',
          borderRadius: 'var(--radius-sm)'
        }}>
          Progress: {Math.round(((currentIndex) / questions.length) * 100)}%
        </span>
      </div>

      <h3 className="quiz-question">{question}</h3>

      <div className="quiz-options">
        {options.map((option, idx) => {
          let btnClass = 'option-btn';
          let showIcon = null;

          if (showFeedback) {
            if (idx === correctAnswerIndex) {
              btnClass += ' correct';
              showIcon = <Check size={18} style={{ color: 'var(--success)' }} />;
            } else if (idx === selectedOption) {
              btnClass += ' incorrect';
              showIcon = <X size={18} style={{ color: 'var(--error)' }} />;
            } else {
              // Dim other options during feedback
              btnClass += ' disabled';
            }
          } else if (idx === selectedOption) {
            btnClass += ' selected';
          }

          return (
            <button
              key={idx}
              className={btnClass}
              onClick={() => handleOptionClick(idx)}
              disabled={showFeedback}
              aria-label={`Option ${idx + 1}: ${option}`}
            >
              <span>{option}</span>
              {showIcon && <span className="option-icon">{showIcon}</span>}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className={`feedback-panel ${selectedOption === correctAnswerIndex ? 'correct' : 'incorrect'}`}>
          <div className="feedback-title" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {selectedOption === correctAnswerIndex ? (
              <>
                <Check size={18} />
                <span>Correct! Good job.</span>
              </>
            ) : (
              <>
                <X size={18} />
                <span>Incorrect Answer</span>
              </>
            )}
          </div>
          <p className="explanation-text">
            <strong>Explanation:</strong> {explanation}
          </p>
        </div>
      )}

      {showFeedback && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleNextClick} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Score'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

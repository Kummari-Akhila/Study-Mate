import React from 'react';
import { RotateCcw, AlertTriangle, ArrowLeft, GraduationCap } from 'lucide-react';

export default function Progress({ 
  questions, 
  userAnswers, 
  onRetryWrong, 
  onRestartFull, 
  onBackToNotes,
  isRetrySession
}) {
  // Calculate results
  let correctCount = 0;
  const wrongAnswersList = [];

  questions.forEach((q, index) => {
    const chosen = userAnswers[index];
    if (chosen === q.correctAnswerIndex) {
      correctCount++;
    } else {
      wrongAnswersList.push({
        question: q.question,
        options: q.options,
        correctAnswer: q.options[q.correctAnswerIndex],
        userAnswer: chosen !== undefined ? q.options[chosen] : 'No answer provided',
        explanation: q.explanation
      });
    }
  });

  const totalQuestions = questions.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // Grade review message
  let feedbackMessage = 'Keep going! Try reviewing your notes again.';
  if (scorePercentage === 100) {
    feedbackMessage = '🏆 Mastered! Perfect Score!';
  } else if (scorePercentage >= 80) {
    feedbackMessage = '🌟 Excellent work! Almost perfect.';
  } else if (scorePercentage >= 50) {
    feedbackMessage = '📚 Good effort. A bit more study will help.';
  }

  return (
    <div className="glass-panel fade-in" style={{ maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        {isRetrySession ? 'Retry Session Completed' : 'Quiz Completed'}
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{feedbackMessage}</p>

      {/* Visual score display */}
      <div className="score-circle-wrapper">
        <div className="score-circle">
          <div className="score-number">{correctCount}</div>
          <div className="score-total">out of {totalQuestions}</div>
        </div>
      </div>

      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '2.5rem' }}>
        Score: {scorePercentage}%
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.85rem', 
        maxWidth: '350px', 
        margin: '0 auto 3rem auto' 
      }}>
        {wrongAnswersList.length > 0 && (
          <button onClick={onRetryWrong} className="btn btn-primary">
            <GraduationCap size={20} />
            <span>Retry Wrong Answers ({wrongAnswersList.length})</span>
          </button>
        )}
        
        <button onClick={onRestartFull} className="btn btn-secondary">
          <RotateCcw size={18} />
          <span>Restart Entire Quiz</span>
        </button>

        <button onClick={onBackToNotes} className="btn btn-secondary" style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} />
          <span>Back to Notes Input</span>
        </button>
      </div>

      {/* Wrong Answers breakdown */}
      {wrongAnswersList.length > 0 && (
        <div className="wrong-answers-section">
          <h3 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.2rem', 
            color: 'var(--error)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <AlertTriangle size={18} />
            <span>Review Wrong Answers</span>
          </h3>

          <div className="wrong-answers-list">
            {wrongAnswersList.map((item, idx) => (
              <div key={idx} className="wrong-answer-item">
                <p className="wrong-question-text">{item.question}</p>
                <div className="wrong-solution-row" style={{ color: 'var(--error)' }}>
                  <span>Your Answer:</span> {item.userAnswer}
                </div>
                <div className="wrong-solution-row" style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>
                  <span>Correct Answer:</span> {item.correctAnswer}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  <em>Note: {item.explanation}</em>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { RotateCcw, AlertTriangle, ArrowLeft, GraduationCap, Trophy, Star, Target } from 'lucide-react';

export default function ScorePage({ 
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

  // Grade info
  let feedbackMessage = 'Keep going! Try reviewing your notes again.';
  let gradeLabel = 'Needs Work';
  let gradeColor = 'var(--error)';
  let CircleIcon = Target;

  if (scorePercentage === 100) {
    feedbackMessage = 'Absolute perfection! You\'ve completely mastered this topic!';
    gradeLabel = 'Perfect!';
    gradeColor = '#f59e0b';
    CircleIcon = Trophy;
  } else if (scorePercentage >= 80) {
    feedbackMessage = 'Excellent work! You\'re almost there — review the few misses to lock it in.';
    gradeLabel = 'Excellent';
    gradeColor = 'var(--success)';
    CircleIcon = Star;
  } else if (scorePercentage >= 50) {
    feedbackMessage = 'Good effort! Review the wrong answers below and retry to improve.';
    gradeLabel = 'Good';
    gradeColor = 'var(--secondary)';
    CircleIcon = GraduationCap;
  }

  // Circumference for SVG ring
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (scorePercentage / 100) * circumference;

  return (
    <div className="score-page fade-in">
      {/* Background glows */}
      <div className="score-bg-glow" />

      {/* Page header */}
      <div className="score-page-header">
        <button onClick={onBackToNotes} className="btn btn-secondary score-back-btn">
          <ArrowLeft size={18} />
          <span>Back to Notes</span>
        </button>
        <h1 className="score-page-title">
          {isRetrySession ? '🔁 Retry Session Results' : '🎓 Quiz Results'}
        </h1>
        <div style={{ width: '140px' }} />
      </div>

      {/* Main Score Card */}
      <div className="score-main-card glass-panel">
        <p className="score-subtitle">{feedbackMessage}</p>

        {/* SVG Ring Score */}
        <div className="score-ring-wrap">
          <svg className="score-ring-svg" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
            {/* Track */}
            <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            {/* Progress */}
            <circle
              cx="70" cy="70" r={radius}
              fill="none"
              stroke={gradeColor}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '70px 70px',
                transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)',
                filter: `drop-shadow(0 0 8px ${gradeColor})`
              }}
            />
          </svg>
          <div className="score-ring-inner">
            <CircleIcon size={22} style={{ color: gradeColor, marginBottom: '2px' }} />
            <span className="score-ring-pct" style={{ color: gradeColor }}>{scorePercentage}%</span>
            <span className="score-ring-label">{gradeLabel}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="score-stats-row">
          <div className="score-stat-box">
            <span className="stat-value" style={{ color: 'var(--success)' }}>{correctCount}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="score-stat-divider" />
          <div className="score-stat-box">
            <span className="stat-value" style={{ color: 'var(--error)' }}>{wrongAnswersList.length}</span>
            <span className="stat-label">Wrong</span>
          </div>
          <div className="score-stat-divider" />
          <div className="score-stat-box">
            <span className="stat-value" style={{ color: 'var(--text-primary)' }}>{totalQuestions}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="score-actions">
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
        </div>
      </div>

      {/* Wrong Answers Breakdown */}
      {wrongAnswersList.length > 0 && (
        <div className="score-wrong-section glass-panel">
          <h2 className="score-wrong-title">
            <AlertTriangle size={20} />
            <span>Review Wrong Answers</span>
          </h2>

          <div className="wrong-answers-list">
            {wrongAnswersList.map((item, idx) => (
              <div key={idx} className="wrong-answer-item-page">
                <div className="wrong-item-number">Q{idx + 1}</div>
                <div className="wrong-item-body">
                  <p className="wrong-question-text">{item.question}</p>
                  <div className="wrong-answer-pills">
                    <span className="pill pill-wrong">
                      ✗ Your answer: {item.userAnswer}
                    </span>
                    <span className="pill pill-correct">
                      ✓ Correct: {item.correctAnswer}
                    </span>
                  </div>
                  <p className="wrong-explanation">
                    💡 <em>{item.explanation}</em>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

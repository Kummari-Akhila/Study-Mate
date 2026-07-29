import { useState, useCallback } from 'react';

/**
 * Custom React Hook to manage Quiz state machine.
 * Supports taking a quiz, calculating score, tracking wrong answers, and retrying only the wrong questions.
 */
export function useQuiz(initialQuestions = []) {
  const [questions, setQuestions] = useState(initialQuestions);
  
  // Track index of current question in the active list
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Store user answers. Key: index in 'questions', Value: chosen option index
  const [userAnswers, setUserAnswers] = useState({});
  
  // Is the quiz completed and score screen active
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Is this a retry session containing only previously failed questions?
  const [isRetrySession, setIsRetrySession] = useState(false);
  
  // Keep track of original quiz question pool to show stats/progress accurately
  const [originalPool, setOriginalPool] = useState(initialQuestions);

  // Initialize or change the question pool
  const initQuiz = useCallback((newQuestions) => {
    setQuestions(newQuestions);
    setOriginalPool(newQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    setIsRetrySession(false);
  }, []);

  // Answer current question
  const selectAnswer = useCallback((answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: answerIndex
    }));
  }, [currentIndex]);

  // Advance to next question or complete quiz
  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  }, [currentIndex, questions.length]);

  // Back to previous question
  const prevQuestion = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  // Compute stats: score, correct count, list of wrong items
  const getStats = useCallback(() => {
    let correctCount = 0;
    const wrongQuestionsList = [];

    questions.forEach((q, index) => {
      const chosen = userAnswers[index];
      if (chosen === q.correctAnswerIndex) {
        correctCount++;
      } else {
        wrongQuestionsList.push({
          ...q,
          originalIndex: index, // Track original index for reference if needed
          userAnswerIndex: chosen
        });
      }
    });

    return {
      totalQuestions: questions.length,
      correctCount,
      scorePercentage: questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0,
      wrongQuestions: wrongQuestionsList
    };
  }, [questions, userAnswers]);

  // Prepare quiz for retrying ONLY the wrong answers
  const startRetryWrongAnswers = useCallback(() => {
    const { wrongQuestions } = getStats();
    if (wrongQuestions.length === 0) return;

    // Map wrong questions into new format, preserving correct answers
    const nextQuestions = wrongQuestions.map(q => ({
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      explanation: q.explanation
    }));

    setQuestions(nextQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    setIsRetrySession(true);
  }, [getStats]);

  // Restart the full quiz
  const restartFullQuiz = useCallback(() => {
    setQuestions(originalPool);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    setIsRetrySession(false);
  }, [originalPool]);

  return {
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] || null,
    userAnswers,
    isCompleted,
    isRetrySession,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    initQuiz,
    getStats,
    startRetryWrongAnswers,
    restartFullQuiz,
    hasAnswers: Object.keys(userAnswers).length > 0
  };
}

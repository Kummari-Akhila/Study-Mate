import React, { useState, useRef, useEffect } from 'react';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import Home from './pages/Home';
import FlashCard from './components/FlashCard';
import Quiz from './components/Quiz';
import ScorePage from './pages/ScorePage';
import LoginPage from './pages/LoginPage';
import { generateStudyAssistantContent } from './services/aiService';
import { parseAndValidateAIResponse } from './utils/parser';
import { useQuiz } from './hooks/useQuiz';
import { Layers, GraduationCap } from 'lucide-react';

export default function App() {
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Navigation: 'flashcards' | 'quiz'
  const [activeTab, setActiveTab] = useState('flashcards');
  const [cardIndex, setCardIndex] = useState(0);

  // Page routing: 'main' | 'score' | 'login'
  const [currentPage, setCurrentPage] = useState('main');

  // Logged-in user
  const [user, setUser] = useState(null);

  // Score page data (captured when quiz completes)
  const [scoreData, setScoreData] = useState(null);

  // Instantiating the custom quiz state machine hook
  const quiz = useQuiz([]);

  // Ref to store AbortController to prevent stale responses overwriting newer requests
  const abortControllerRef = useRef(null);

  // Synchronize quiz when studyData changes
  useEffect(() => {
    if (studyData?.quiz) {
      quiz.initQuiz(studyData.quiz);
      setCardIndex(0);
    }
  }, [studyData]);

  // Clean up abort controllers on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // API Call Coordinator
  const handleGenerate = async (notesText) => {
    // 1. Cancel any existing pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('🔄 [App] Cancelled previous pending generation request.');
    }

    // 2. Setup new controller and update states
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    setIsLoading(true);
    setError(null);
    setStudyData(null);
    setCurrentPage('main');

    // 3. Set a safety timeout to abort request if it takes too long (> 60 seconds)
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn('⏱️ [App] API request timed out (60s threshold reached).');
    }, 60000);

    // 4. Fetch content
    const result = await generateStudyAssistantContent(notesText, controller.signal);
    clearTimeout(timeoutId);

    // 5. Handle response if this request wasn't cancelled/overwritten
    if (abortControllerRef.current === controller) {
      setIsLoading(false);
      if (result.success) {
        setStudyData(result.data);
      } else {
        setError(result.error);
      }
    }
  };

  const handleUseFallback = () => {
    setError(null);
    setIsLoading(false);
    const fallback = parseAndValidateAIResponse(null); // Triggers default mock data
    setStudyData(fallback.data);
  };

  const handleBackToNotes = () => {
    setStudyData(null);
    setError(null);
    setIsLoading(false);
    setActiveTab('flashcards');
    setCurrentPage('main');
    setScoreData(null);
  };

  // Called by Quiz when last question is answered — navigate to Score page
  const handleQuizComplete = (userAnswers) => {
    setScoreData({
      questions: quiz.questions,
      userAnswers,
      isRetrySession: quiz.isRetrySession,
    });
    setCurrentPage('score');
  };

  const handleRetryWrong = () => {
    quiz.startRetryWrongAnswers();
    setScoreData(null);
    setCurrentPage('main');
    setActiveTab('quiz');
  };

  const handleRestartFull = () => {
    quiz.restartFullQuiz();
    setScoreData(null);
    setCurrentPage('main');
    setActiveTab('quiz');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setUser(null);
  };

  // ── Score Page ──────────────────────────────────────────────
  if (currentPage === 'score' && scoreData) {
    return (
      <div className="app-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
        <Navbar
          currentTitle={studyData?.title}
          onGoHome={handleBackToNotes}
          user={user}
          onLoginClick={() => setCurrentPage('login')}
          onLogout={handleLogout}
        />
        <main className="container">
          <ScorePage
            questions={scoreData.questions}
            userAnswers={scoreData.userAnswers}
            isRetrySession={scoreData.isRetrySession}
            onRetryWrong={handleRetryWrong}
            onRestartFull={handleRestartFull}
            onBackToNotes={handleBackToNotes}
          />
        </main>
      </div>
    );
  }

  // ── Login Page ──────────────────────────────────────────────
  if (currentPage === 'login') {
    return (
      <div className="app-container">
        <div className="bg-glow-1" />
        <div className="bg-glow-2" />
        <Navbar
          currentTitle={studyData?.title}
          onGoHome={() => setCurrentPage('main')}
          user={user}
          onLoginClick={() => setCurrentPage('login')}
          onLogout={handleLogout}
        />
        <main className="container">
          <LoginPage
            onClose={() => setCurrentPage('main')}
            onLoginSuccess={handleLoginSuccess}
          />
        </main>
      </div>
    );
  }

  // ── Main Page ───────────────────────────────────────────────
  return (
    <div className="app-container">
      {/* Dynamic ambient gradients */}
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <Navbar
        currentTitle={studyData?.title}
        onGoHome={handleBackToNotes}
        user={user}
        onLoginClick={() => setCurrentPage('login')}
        onLogout={handleLogout}
      />

      <main className="container">
        {/* State 1: Loading State */}
        {isLoading && <Loading />}

        {/* State 2: Main Home Page Inputs */}
        {!isLoading && !studyData && (
          <Home 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
            error={error} 
            onUseFallback={handleUseFallback}
            onClearError={() => setError(null)}
          />
        )}

        {/* State 3: Active Interactive Content Display */}
        {!isLoading && studyData && (
          <div className="fade-in">
            {/* View Switcher Tabs */}
            <div className="tab-container">
              <button 
                onClick={() => setActiveTab('flashcards')} 
                className={`tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
                aria-label="Switch to Flashcards Mode"
              >
                <Layers size={18} />
                <span>Flashcards ({studyData.flashcards.length})</span>
              </button>
              <button 
                onClick={() => setActiveTab('quiz')} 
                className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                aria-label="Switch to Quiz Mode"
              >
                <GraduationCap size={18} />
                <span>Quiz ({quiz.questions.length})</span>
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === 'flashcards' && (
              <FlashCard
                card={studyData.flashcards[cardIndex]}
                cardIndex={cardIndex}
                totalCards={studyData.flashcards.length}
                onNext={() => setCardIndex(prev => Math.min(prev + 1, studyData.flashcards.length - 1))}
                onPrev={() => setCardIndex(prev => Math.max(prev - 1, 0))}
              />
            )}

            {activeTab === 'quiz' && (
              <Quiz
                key={quiz.isRetrySession ? 'retry' : 'full'}
                questions={quiz.questions}
                onCompleted={handleQuizComplete}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Question, ViewMode } from './types';
import { Header } from './components/Header';
import { Flashcard } from './components/Flashcard';
import { Button } from './components/Button';

// Versioned keys for storage isolation - updated to v8 for a clean slate
const MASTERED_KEY = 'equistudy_mastered_v8';
const QUEUE_KEY = 'equistudy_session_queue_v8';
const INDEX_KEY = 'equistudy_session_index_v8';

const App: React.FC = () => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [masteredIds, setMasteredIds] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionQueue, setSessionQueue] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data and saved progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./data/questions.json');
        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();
        setAllQuestions(data);
        
        const savedMastered = localStorage.getItem(MASTERED_KEY);
        const savedQueue = localStorage.getItem(QUEUE_KEY);
        const savedIndex = localStorage.getItem(INDEX_KEY);

        if (savedMastered) setMasteredIds(JSON.parse(savedMastered));
        if (savedQueue) setSessionQueue(JSON.parse(savedQueue));
        if (savedIndex) setCurrentIndex(parseInt(savedIndex, 10) || 0);
        
        setIsLoaded(true);
      } catch (err) {
        console.error("Init error:", err);
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  // Sync state to persistence
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(MASTERED_KEY, JSON.stringify(masteredIds));
      localStorage.setItem(QUEUE_KEY, JSON.stringify(sessionQueue));
      localStorage.setItem(INDEX_KEY, currentIndex.toString());
    } catch (e) {
      console.error("Storage sync failed:", e);
    }
  }, [masteredIds, sessionQueue, currentIndex, isLoaded]);

  // RESET AND START: Wipes all history and starts a fresh session with ALL questions
  // Removed confirmation to ensure immediate action as requested
  const startNewRoundFromScratch = useCallback(() => {
    if (allQuestions.length === 0) return;

    // 1. Reset all history and session state
    setMasteredIds([]);
    
    // 2. Shuffle ALL 101 questions
    const shuffledIds = [...allQuestions]
      .map(q => q.id)
      .sort(() => Math.random() - 0.5);
    
    // 3. Update State immediately
    setSessionQueue(shuffledIds);
    setCurrentIndex(0);
    setViewMode(ViewMode.STUDY);
    
    // 4. Force immediate persistence update (optional but safer)
    localStorage.removeItem(MASTERED_KEY);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(shuffledIds));
    localStorage.setItem(INDEX_KEY, "0");
  }, [allQuestions]);

  const handleResponse = (gotIt: boolean) => {
    if (gotIt) {
      const currentId = sessionQueue[currentIndex];
      setMasteredIds(prev => prev.includes(currentId) ? prev : [...prev, currentId]);
      
      if (currentIndex >= sessionQueue.length - 1) {
        setSessionQueue([]);
        setCurrentIndex(0);
        setViewMode(ViewMode.SUMMARY);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      // Re-queue the card at the end of the session to ensure it's mastered later
      const newQueue = [...sessionQueue];
      const [item] = newQueue.splice(currentIndex, 1);
      newQueue.push(item);
      setSessionQueue(newQueue);
      // currentIndex stays the same, so the next card in the queue is shown
    }
  };

  const isFullyMastered = useMemo(() => 
    allQuestions.length > 0 && masteredIds.length === allQuestions.length
  , [allQuestions.length, masteredIds.length]);

  const hasActiveSession = useMemo(() => 
    sessionQueue.length > 0 && currentIndex < sessionQueue.length
  , [sessionQueue.length, currentIndex]);

  if (!isLoaded || allQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-white font-system">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 font-semibold italic">EquiStudy Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col font-system select-none overflow-x-hidden">
      <Header 
        current={masteredIds.length} 
        total={allQuestions.length} 
        onBack={viewMode !== ViewMode.DASHBOARD ? () => setViewMode(ViewMode.DASHBOARD) : undefined}
      />

      <main className="flex-1 px-6 py-8">
        {viewMode === ViewMode.DASHBOARD && (
          <div className="flex flex-col gap-10 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2 pt-4">
              <h1 className="text-4xl font-extrabold tracking-tight">EquiStudy</h1>
              <p className="text-slate-500 text-lg font-medium">Horse Knowledge Master</p>
            </div>

            <div className="bg-white rounded-3xl p-8 ios-card-shadow flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Total Mastery</h2>
                <span className="text-2xl font-black text-[#007AFF] tabular-nums">
                  {Math.round((masteredIds.length / allQuestions.length) * 100)}%
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Mastered</span>
                  <span className="text-2xl font-bold text-slate-800 tabular-nums">{masteredIds.length}</span>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Total Set</span>
                  <span className="text-2xl font-bold text-slate-800 tabular-nums">{allQuestions.length}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {hasActiveSession && (
                  <Button onClick={() => setViewMode(ViewMode.STUDY)} fullWidth>
                    Continue Session
                  </Button>
                )}
                
                <Button 
                  onClick={startNewRoundFromScratch} 
                  variant={hasActiveSession ? "secondary" : "primary"} 
                  fullWidth
                >
                  Start New Round
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-6 items-center mt-2">
              <p className="text-slate-400 text-[11px] text-center px-4 leading-relaxed font-medium">
                Tap "Start New Round" to clear history and begin the full set of 101 questions.
              </p>
            </div>
          </div>
        )}

        {viewMode === ViewMode.STUDY && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="flex justify-center mb-2">
               <span className="bg-white/70 backdrop-blur-sm px-4 py-1.5 rounded-full text-[13px] font-bold text-slate-500 border border-slate-200 shadow-sm tabular-nums">
                 Card {currentIndex + 1} of {sessionQueue.length}
               </span>
            </div>
            <Flashcard 
              key={sessionQueue[currentIndex]}
              question={allQuestions.find(q => q.id === sessionQueue[currentIndex])!} 
              onResponse={handleResponse}
            />
          </div>
        )}

        {viewMode === ViewMode.SUMMARY && (
          <div className="flex flex-col items-center justify-center gap-8 py-12 max-w-md mx-auto animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-[#34C759] rounded-full flex items-center justify-center text-white shadow-xl shadow-green-100">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div className="text-center space-y-2 px-4">
              <h2 className="text-3xl font-bold">Round Finished!</h2>
              <p className="text-slate-500 text-lg">
                {isFullyMastered 
                  ? "Outstanding! You've mastered all 101 facts for the Horse Brevet." 
                  : `You finished this round. Mastery: ${masteredIds.length} / ${allQuestions.length}`}
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <Button onClick={() => setViewMode(ViewMode.DASHBOARD)} fullWidth>
                Back to Dashboard
              </Button>
              <Button variant="secondary" onClick={startNewRoundFromScratch} fullWidth>
                Start Over Again
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="p-6 safe-bottom">
        <p className="text-center text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
          EQUI-STUDY • iOS 18 COMPLIANT
        </p>
      </footer>
    </div>
  );
};

export default App;

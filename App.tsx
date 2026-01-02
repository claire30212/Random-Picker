import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomeView from './views/HomeView';
import InputView from './views/InputView';
import ProcessView from './views/ProcessView';
import ResultView from './views/ResultView';
import { AppMode, DrawType, DrawResultData, PairingResult } from './types';
import { performDraw } from './utils';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>(AppMode.HOME);
  const [selectedDrawType, setSelectedDrawType] = useState<DrawType>(DrawType.PICK_N);
  
  // Draw Data
  const [candidates, setCandidates] = useState<string[]>([]);
  const [candidatesB, setCandidatesB] = useState<string[]>([]); // For Gifts/Dual list
  const [settings, setSettings] = useState({ count: 1, timer: 5 });
  const [results, setResults] = useState<DrawResultData>([]);

  // Check for shared result in URL hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#share=')) {
      try {
        const dataStr = decodeURIComponent(hash.substring(7));
        const data = JSON.parse(atob(dataStr));
        if (data.mode && data.results) {
          setSelectedDrawType(data.mode);
          setResults(data.results);
          setAppMode(AppMode.RESULT);
        }
      } catch (e) {
        console.error("Failed to parse shared link");
      }
    }
  }, []);

  const handleSelectMode = (type: DrawType) => {
    setSelectedDrawType(type);
    setAppMode(AppMode.INPUT);
  };

  const handleInputSubmit = (list: string[], count: number, timer: number, listB?: string[]) => {
    setCandidates(list);
    setCandidatesB(listB || []);
    setSettings({ count, timer });
    setAppMode(AppMode.PROCESS);
  };

  const handleProcessComplete = (visualResults?: any) => {
    if (visualResults) {
      // If the process view generated results (e.g., Ladder visualizer), use them
      setResults(visualResults);
    } else {
      // Otherwise perform calculation here
      const finalResults = performDraw(
        selectedDrawType, 
        candidates, 
        settings.count,
        candidatesB
      );
      setResults(finalResults);
    }
    setAppMode(AppMode.RESULT);
  };

  const handleRestart = () => {
    setAppMode(AppMode.INPUT);
    setResults([]);
  };

  const handleGoHome = () => {
    if (window.confirm("確定要回到首頁嗎？目前的進度將會遺失。")) {
      setAppMode(AppMode.HOME);
      setCandidates([]);
      setCandidatesB([]);
      setResults([]);
    }
  };

  // Safe Home Click (no confirm needed if on Home)
  const safeGoHome = () => {
    if (appMode === AppMode.HOME) return;
    handleGoHome();
  };

  return (
    <Layout onHomeClick={safeGoHome}>
      {appMode === AppMode.HOME && (
        <HomeView onSelectMode={handleSelectMode} />
      )}
      
      {appMode === AppMode.INPUT && (
        <InputView 
          mode={selectedDrawType} 
          onSubmit={handleInputSubmit} 
          onBack={() => setAppMode(AppMode.HOME)}
        />
      )}

      {appMode === AppMode.PROCESS && (
        <ProcessView 
          mode={selectedDrawType}
          candidates={candidates}
          gifts={candidatesB}
          timerSetting={settings.timer}
          onComplete={handleProcessComplete}
        />
      )}

      {appMode === AppMode.RESULT && (
        <ResultView 
          mode={selectedDrawType}
          results={results}
          onRestart={handleRestart}
        />
      )}
    </Layout>
  );
};

export default App;
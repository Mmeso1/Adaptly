import { useState } from 'react';
import LandingPage from './components/LandingPage';
import WorkspacePage from './components/WorkspacePage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'workspace'>('landing');

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('workspace')} />
      )}
      {currentPage === 'workspace' && (
        <WorkspacePage onBack={() => setCurrentPage('landing')} />
      )}
    </>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Setup from './Setup.jsx';
import './index.css';

function Root() {
  const [setupDone, setSetupDone] = useState(null); // null = checking

  useEffect(() => {
    if (!window.electronAPI) {
      // Running in a plain browser (dev without Electron): skip setup
      setSetupDone(true);
      return;
    }
    window.electronAPI.checkSetup().then(({ complete }) => setSetupDone(complete));
  }, []);

  if (setupDone === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #2a3045', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!setupDone) {
    return <Setup onComplete={() => setSetupDone(true)} />;
  }

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);

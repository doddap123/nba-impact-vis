import React from 'react';
import './App.css';                 
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main application container with a neutral background */}
      <Dashboard />
    </div>
  );
}

export default App;

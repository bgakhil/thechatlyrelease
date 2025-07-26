// src/App.tsx
import React from 'react';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <>
      <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h1>Welcome to TheChatly 🚀</h1>
        <p>This is a random chat web app hosted on GitHub Pages.</p>
      </main>
      <Toaster />
    </>
  );
}

export default App;

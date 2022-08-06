import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// manual
import './styles/reset.css';
import './styles/index.css';
// uno
import 'virtual:uno.css';

ReactDOM.createRoot(document.getElementById('root') as Element).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

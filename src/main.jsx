import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

window.onerror = function (message, source, lineno, colno, error) {
  document.body.innerHTML = `
    <div style="padding: 20px; color: white; background: #c00; font-family: sans-serif;">
      <h1>Erro Crítico</h1>
      <p>${message}</p>
      <pre>${error?.stack || ''}</pre>
    </div>
  `;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// SPA redirect pickup for GitHub Pages: see public/404.html
const stashed = sessionStorage.getItem('spa-redirect')
if (stashed) {
  sessionStorage.removeItem('spa-redirect')
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  history.replaceState(null, '', base + stashed)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

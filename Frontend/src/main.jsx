import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import './App.css' // Importing the main CSS file for global styles
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

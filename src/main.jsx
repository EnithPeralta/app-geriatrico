import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GeriatricoApp } from './GeriatricoApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GeriatricoApp />
    </BrowserRouter>  
    </StrictMode>,
)

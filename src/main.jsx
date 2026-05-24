import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import L from 'leaflet';
import './index.css'
import App from './App.jsx'

L.TileLayer.prototype.options.referrerPolicy =
  'strict-origin-when-cross-origin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)


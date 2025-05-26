import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import App from './pages/App.jsx'
import AdultForm from './pages/AdultForm.jsx'
import MinorForm from './pages/MinorForm.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/form/adult" element={<AdultForm />} />
        <Route path="/form/minor" element={<MinorForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

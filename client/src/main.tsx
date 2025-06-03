import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router'
import AppContextProvider from './context/AppContext.tsx'
import { ToastContainer } from "react-toastify";




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        <App />
        <ToastContainer />
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
)

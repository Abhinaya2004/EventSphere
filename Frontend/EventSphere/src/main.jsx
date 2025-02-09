import { createRoot } from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from './App.jsx'
import './App.css'
import AuthProvider from './components/AuthProvider.jsx'
createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
)

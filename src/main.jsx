import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useAuth } from './shared/api/useAuth.js';
import { AuthProvider } from './shared/lib/contexts/AuthProvider.jsx';
import { LoginPage } from './pages/Login/LoginPage.jsx';
export const Main = () => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <App/> : <LoginPage />
}
createRoot(document.getElementById('root')).render(
  <>
    <AuthProvider>
      <Main/>
    </AuthProvider>
  </>,
)

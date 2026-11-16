import { Navigate, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import AIAssistant from './AIAssistant';
import { useAuth } from '../context/AuthContext';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <span className="spinner" aria-hidden="true" />
        <p>Cargando Sanriocommerce…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}

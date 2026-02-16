import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Designer from './pages/Designer';
import Admin from './pages/Admin';
import Pricing from './pages/Pricing';
import Quote from './pages/Quote';

function ProtectedRoute({ children, adminOnly }) {
  const { user, loading } = useAuth();
  if (loading) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><div className="skeleton w-12 h-12 rounded-full" /></div></Layout>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Landing /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
      <Route path="/quote" element={<Layout><Quote /></Layout>} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/designer" element={<ProtectedRoute><Layout><Designer /></Layout></ProtectedRoute>} />
      <Route path="/designer/:id" element={<ProtectedRoute><Layout><Designer /></Layout></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><Layout><Admin /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

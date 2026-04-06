// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout/Layout';
import { ToastProvider } from './components/common/UI';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import HODDashboard from './pages/HOD/HODDashboard';
import ProfileBuilder from './pages/Faculty/ProfileBuilder';
import ApprovalsBoard from './pages/HOD/ApprovalsBoard';
import FacultyList from './pages/HOD/FacultyList';
import ContentStudio from './pages/Admin/ContentStudio';
import MySubmissions from './pages/Shared/MySubmissions';
import Trending from './pages/HOD/Trending';

function GuardedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard"    element={<GuardedRoute><Dashboard /></GuardedRoute>} />
      <Route path="/hod-dashboard" element={<GuardedRoute roles={['HOD']}><HODDashboard /></GuardedRoute>} />
      <Route path="/profile"       element={<GuardedRoute roles={['FACULTY','HOD']}><ProfileBuilder /></GuardedRoute>} />
      <Route path="/approvals"     element={<GuardedRoute roles={['HOD','ADMIN']}><ApprovalsBoard /></GuardedRoute>} />
      <Route path="/faculty-list"  element={<GuardedRoute roles={['HOD','ADMIN']}><FacultyList /></GuardedRoute>} />
      <Route path="/content"       element={<GuardedRoute roles={['HOD','ADMIN']}><ContentStudio /></GuardedRoute>} />
      <Route path="/trending"      element={<GuardedRoute roles={['HOD','ADMIN']}><Trending /></GuardedRoute>} />
      <Route path="/submissions"   element={<GuardedRoute><MySubmissions /></GuardedRoute>} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

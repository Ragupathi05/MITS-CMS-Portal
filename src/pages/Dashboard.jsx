// src/pages/Dashboard.jsx
import { useAuth } from '../context/useAuth';
import FacultyDashboard from './Faculty/FacultyDashboard';
import ProfileBuilder from './Faculty/ProfileBuilder';
import AdminDashboard from './Admin/AdminDashboard';

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'FACULTY') return <FacultyDashboard />;
  if (user.role === 'HOD')     return <ProfileBuilder />;
  if (user.role === 'ADMIN')   return <AdminDashboard />;
  return null;
}

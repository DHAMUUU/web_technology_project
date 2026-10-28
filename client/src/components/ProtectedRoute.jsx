import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function ProtectedRoute() { const { user } = useAuth(); return user ? <Outlet /> : <Navigate to="/login" replace />; }
export function AdminRoute() { const { user } = useAuth(); return user?.role === 'admin' ? <Outlet /> : <Navigate to={user ? '/user/dashboard' : '/login'} replace />; }

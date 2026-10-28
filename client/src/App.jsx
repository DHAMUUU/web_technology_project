import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { UserDashboard, NoticeDetails, ChangePassword } from './pages/BoardPages';
import { AdminHome, AdminNotices, AdminUsers } from './pages/AdminPages';
import { useAuth } from './context/AuthContext';
function StartRoute(){const {user}=useAuth();return <Navigate to={user?(user.role==='admin'?'/admin/home':'/user/dashboard'):'/login'} replace/>;}
export default function App(){return <BrowserRouter><Navbar/><main className="container app-main"><Routes><Route path="/" element={<StartRoute/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/><Route element={<ProtectedRoute/>}><Route path="/user/dashboard" element={<UserDashboard/>}/><Route path="/notices/:id" element={<NoticeDetails/>}/><Route path="/change-password" element={<ChangePassword/>}/></Route><Route element={<AdminRoute/>}><Route path="/admin/home" element={<AdminHome/>}/><Route path="/admin/notices" element={<AdminNotices/>}/><Route path="/admin/users" element={<AdminUsers/>}/></Route><Route path="*" element={<StartRoute/>}/></Routes></main><footer className="app-footer"><div className="container"><span>noticeboard</span><span>Campus updates, together.</span></div></footer></BrowserRouter>;}

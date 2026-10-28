import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function Navbar() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  return <nav className="navbar navbar-expand-lg navbar-dark app-nav"><div className="container">
    <Link className="navbar-brand fw-bold" to={user?.role === 'admin' ? '/admin/home' : '/user/dashboard'}><span className="brand-mark">N</span> noticeboard</Link>
    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav" aria-label="Toggle navigation"><span className="navbar-toggler-icon"/></button>
    <div className="collapse navbar-collapse" id="nav"><div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
      {user ? <>{user.role === 'admin' ? <><NavLink className="nav-link" to="/admin/home">Overview</NavLink><NavLink className="nav-link" to="/admin/notices">Notices</NavLink><NavLink className="nav-link" to="/admin/users">People</NavLink></> : <NavLink className="nav-link" to="/user/dashboard">Notices</NavLink>}
      <NavLink className="nav-link" to="/change-password">Settings</NavLink><span className="nav-user">{user.name}</span><button className="btn btn-sm btn-outline-light" onClick={() => { logout(); navigate('/login'); }}>Sign out</button></> : <><NavLink className="nav-link" to="/login">Sign in</NavLink><Link className="btn btn-sm btn-light" to="/register">Create account</Link></>}
    </div></div>
  </div></nav>;
}

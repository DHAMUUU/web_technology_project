import { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, BookOpen, CalendarDays, ChevronRight, CircleUserRound, FileText, LayoutDashboard, LogOut, Menu, Moon, Search, Settings2, Shield, Sun, Users, X, Bookmark, ClipboardList, House } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const paths = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/notices', label: 'Notice board', icon: FileText },
  { to: '/calendar', label: 'Academic calendar', icon: CalendarDays },
  { to: '/bookmarks', label: 'My bookmarks', icon: Bookmark },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];
const adminPaths = [
  { to: '/admin/notices', label: 'Manage notices', icon: FileText },
  { to: '/admin/users', label: 'People', icon: Users },
  { to: '/admin/audit', label: 'Audit log', icon: ClipboardList },
];
const titles = { '/dashboard': 'Overview', '/notices': 'Notice board', '/calendar': 'Academic calendar', '/bookmarks': 'My bookmarks', '/notifications': 'Notifications', '/profile': 'Profile & settings', '/change-password': 'Change password', '/admin/notices': 'Manage notices', '/admin/users': 'People', '/admin/audit': 'Audit log' };

function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const link = item => <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => `side-link ${isActive ? 'is-active' : ''}`}><item.icon size={18} strokeWidth={1.8}/><span>{item.label}</span>{item.badge ? <b>{item.badge}</b> : null}</NavLink>;
  return <aside className="sidebar"><NavLink to="/dashboard" className="brand-lockup" onClick={onNavigate}><span className="brand-symbol"><House size={18}/></span><span>Campus<span>Hub</span></span></NavLink><div className="workspace-pill"><span className="workspace-avatar">C</span><span><strong>Campus workspace</strong><small>Student community</small></span><ChevronRight size={15}/></div><div className="side-label">WORKSPACE</div><nav className="side-nav" aria-label="Main navigation">{paths.map(link)}</nav>{user?.role === 'admin' && <><div className="side-label side-label-admin"><Shield size={13}/> ADMINISTRATION</div><nav className="side-nav" aria-label="Administration">{adminPaths.map(link)}</nav></>}<div className="sidebar-bottom"><NavLink to="/profile" onClick={onNavigate} className={({ isActive }) => `side-link ${isActive ? 'is-active' : ''}`}><Settings2 size={18}/><span>Profile & settings</span></NavLink><button className="side-link side-logout" onClick={()=>{logout();onNavigate();navigate('/login');}}><LogOut size={18}/><span>Sign out</span></button><div className="sidebar-help"><BookOpen size={17}/><div><strong>Stay in the loop</strong><span>Your campus, one source.</span></div></div></div></aside>;
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [unread, setUnread] = useState(0);
  const [dark, setDark] = useState(() => localStorage.getItem('campushub_theme') === 'dark');
  const title = useMemo(() => titles[location.pathname] || (location.pathname.startsWith('/notices/') ? 'Notice details' : 'CampusHub'), [location.pathname]);
  useEffect(() => { document.documentElement.dataset.theme = dark ? 'dark' : 'light'; localStorage.setItem('campushub_theme', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);
  useEffect(() => { const refresh=()=>api.get('/notifications',{params:{limit:1}}).then(({data})=>setUnread(data.unread||0)).catch(()=>{});refresh();window.addEventListener('campushub:notifications-changed',refresh);return()=>window.removeEventListener('campushub:notifications-changed',refresh); }, [location.pathname]);
  function submitSearch(event) { event.preventDefault(); const query = search.trim(); navigate(`/notices${query ? `?search=${encodeURIComponent(query)}` : ''}`); }
  return <div className="app-frame">
    {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)}/>}
    <div className={`sidebar-wrap ${mobileOpen ? 'sidebar-open' : ''}`}><button className="mobile-sidebar-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={19}/></button><Sidebar onNavigate={() => setMobileOpen(false)}/></div>
    <div className="app-workspace"><header className="topbar"><div className="topbar-left"><button className="mobile-menu" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20}/></button><div className="breadcrumbs"><span>CampusHub</span><ChevronRight size={14}/><strong>{title}</strong></div></div><form className="global-search" onSubmit={submitSearch}><Search size={17}/><input aria-label="Search campus notices" placeholder="Search notices, events…" value={search} onChange={event => setSearch(event.target.value)}/><kbd>⌘ K</kbd></form><div className="topbar-actions"><button className="icon-button theme-button" aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setDark(value => !value)}>{dark ? <Sun size={18}/> : <Moon size={18}/>}</button><button className="icon-button notification-trigger" aria-label={`${unread} unread notifications`} onClick={() => navigate('/notifications')}><Bell size={18}/>{unread > 0 && <i>{unread > 9 ? '9+' : unread}</i>}</button><span className="topbar-divider"/><button className="user-menu" onClick={() => navigate('/profile')} aria-label="Open profile settings"><span className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</span><span className="user-menu-copy"><strong>{user?.name}</strong><small>{user?.role === 'admin' ? 'Administrator' : 'Campus member'}</small></span><ChevronRight size={14}/></button><button className="icon-button logout-button" title="Sign out" onClick={() => { logout(); navigate('/login'); }}><LogOut size={17}/></button></div></header><main className="page-content"><Outlet/></main><footer className="app-footer"><span>© {new Date().getFullYear()} CampusHub</span><span>Campus communication, made clear.</span></footer></div>
  </div>;
}

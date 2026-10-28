import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/client';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('noticeboard_user')); } catch { return null; } });
  async function login(credentials) { const { data } = await api.post('/auth/login', credentials); localStorage.setItem('noticeboard_token', data.data.token); localStorage.setItem('noticeboard_user', JSON.stringify(data.data.user)); setUser(data.data.user); return data.data.user; }
  async function register(details) { const { data } = await api.post('/auth/register', details); localStorage.setItem('noticeboard_token', data.data.token); localStorage.setItem('noticeboard_user', JSON.stringify(data.data.user)); setUser(data.data.user); return data.data.user; }
  function logout() { localStorage.removeItem('noticeboard_token'); localStorage.removeItem('noticeboard_user'); setUser(null); }
  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

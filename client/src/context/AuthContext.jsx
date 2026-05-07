import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('collaborationos_token');
    if (token) {
      api.getMe()
        .then((data) => { setUser(data.user); setProfile(data.profile); })
        .catch(() => localStorage.removeItem('collaborationos_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('collaborationos_token', data.token);
    setUser(data.user);
    const me = await api.getMe();
    setProfile(me.profile);
    return data.user;
  };

  const signup = async (formData) => {
    const data = await api.signup(formData);
    localStorage.setItem('collaborationos_token', data.token);
    setUser(data.user);
    const me = await api.getMe();
    setProfile(me.profile);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('collaborationos_token');
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

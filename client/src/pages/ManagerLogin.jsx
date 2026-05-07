import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

export default function ManagerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'manager') {
        setError('Access denied. This login is restricted to platform administrators only.');
        setLoading(false);
        return;
      }
      navigate('/manager/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="manager-login-page">
      <div className="manager-login-bg">
        <div className="manager-login-grid" />
        <div className="manager-login-glow" />
      </div>
      <div className="manager-login-container">
        <div className="manager-login-header">
          <div className="manager-shield-icon">
            <Shield size={32} />
          </div>
          <h1>Admin Portal</h1>
          <p>CollaborationHub Platform Administration</p>
        </div>
        <div className="manager-login-card">
          <div className="manager-login-badge">
            <Lock size={14} /> Restricted Access
          </div>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Admin Email</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@collaborationhub.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn btn-manager btn-lg" type="submit" disabled={loading}>
              <Shield size={18} /> {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>
          <div className="manager-login-footer">
            <Link to="/login">← Back to User Login</Link>
          </div>
          <div className="manager-login-notice">
            <Shield size={14} />
            <span>This portal is exclusively for authorized CollaborationHub staff. Unauthorized access attempts are logged and monitored.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

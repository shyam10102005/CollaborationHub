import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Users, Building2 } from 'lucide-react';

const niches = ['Tech & Gaming', 'Fashion & Lifestyle', 'Fitness & Wellness', 'Food & Travel', 'Music & Entertainment', 'Beauty & Skincare', 'Photography & Art', 'Education & Motivation'];
const industries = ['Technology', 'Fashion', 'Health & Wellness', 'Food & Beverage', 'Finance', 'Entertainment', 'Sports', 'Travel', 'Education', 'Automotive', 'Real Estate', 'E-Commerce'];

export default function Signup() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'creator', profile_data: { niche: '', username: '', company_name: '', industry: '' } });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const updateProfile = (key, val) => setForm({ ...form, profile_data: { ...form.profile_data, [key]: val } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'creator', label: 'Creator', icon: Users, desc: 'Content creator' },
    { value: 'brand', label: 'Brand', icon: Building2, desc: 'Advertiser' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Join CollaborationHub</h1>
        <p className="subtitle">Create your account to get started</p>
        {error && <div className="error-msg">{error}</div>}
        <div className="role-selector" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {roles.map(r => (
            <div key={r.value} className={`role-btn ${form.role === r.value ? 'active' : ''}`} onClick={() => setForm({ ...form, role: r.value })}>
              <r.icon size={20} style={{ marginBottom: 4 }} /><br/>
              <strong>{r.label}</strong><br/>
              <span style={{ fontSize: '0.7rem' }}>{r.desc}</span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input className="form-input" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} placeholder="John Doe" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input className="form-input" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" required minLength={6} />
          </div>

          {form.role === 'creator' && (
            <>
              <div className="form-group">
                <label>Username</label>
                <input className="form-input" value={form.profile_data.username} onChange={e => updateProfile('username', e.target.value)} placeholder="@yourhandle" />
              </div>
              <div className="form-group">
                <label>Niche</label>
                <select className="form-select" value={form.profile_data.niche} onChange={e => updateProfile('niche', e.target.value)} required>
                  <option value="">Select your niche...</option>
                  {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </>
          )}

          {form.role === 'brand' && (
            <>
              <div className="form-group">
                <label>Company Name</label>
                <input className="form-input" value={form.profile_data.company_name} onChange={e => updateProfile('company_name', e.target.value)} placeholder="Your company" required />
              </div>
              <div className="form-group">
                <label>Industry</label>
                <select className="form-select" value={form.profile_data.industry} onChange={e => updateProfile('industry', e.target.value)} required>
                  <option value="">Select your industry...</option>
                  {industries.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </>
          )}


          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
            <UserPlus size={18} /> {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FileText, Eye, Save, Share2, Download } from 'lucide-react';

export default function MediaKit() {
  const { user, profile } = useAuth();
  const [kit, setKit] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMediaKit().then(data => { setKit(data); setForm({ title: data.title, tagline: data.tagline, about: data.about, highlights: data.highlights, past_brands: data.past_brands, rates: data.rates }); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    await api.updateMediaKit(form);
    const updated = await api.getMediaKit();
    setKit(updated);
    setEditing(false);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;

  const formatNum = (n) => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(0)+'K' : String(n);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1>Media Kit</h1><p>Your professional portfolio for brand partnerships</p></div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary"><Eye size={16} /> {kit?.view_count || 0} Views</button>
          {editing ? <button className="btn btn-primary" onClick={handleSave}><Save size={16} /> Save</button> : <button className="btn btn-primary" onClick={() => setEditing(true)}>Edit Kit</button>}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 24, background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(6,182,212,0.1))' }}>
          <div className="avatar avatar-xl" style={{ margin: '0 auto 16px' }}>{user?.full_name?.[0]}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{user?.full_name}</h2>
          {editing ? <input className="form-input" style={{ textAlign: 'center', marginTop: 8 }} value={form.tagline || ''} onChange={e => setForm({...form, tagline: e.target.value})} placeholder="Your tagline..." /> : <p style={{ color: 'var(--text-secondary)', marginTop: 4 }}>{kit?.tagline || 'Content Creator & Digital Strategist'}</p>}
          <span className="badge badge-accent" style={{ marginTop: 12 }}>{profile?.niche || 'Creator'}</span>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: 24 }}>
          {[
            { label: 'Followers', value: formatNum(profile?.follower_count || 0) },
            { label: 'Engagement', value: `${profile?.engagement_rate || 0}%` },
            { label: 'Avg Views', value: formatNum(profile?.avg_views || 0) },
            { label: 'Collabs', value: '12+' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ textAlign: 'center' }}>
              <div className="stat-value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>About</h3>
          {editing ? <textarea className="form-textarea" value={form.about || ''} onChange={e => setForm({...form, about: e.target.value})} placeholder="Tell brands about yourself..." /> : <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{kit?.about || profile?.bio || 'No description yet.'}</p>}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Highlights & Achievements</h3>
          {editing ? <textarea className="form-textarea" value={form.highlights || ''} onChange={e => setForm({...form, highlights: e.target.value})} placeholder="Key achievements, awards, press features..." /> : <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{kit?.highlights || 'Add your highlights and achievements.'}</p>}
        </div>

        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Past Brands</h3>
            {editing ? <textarea className="form-textarea" value={form.past_brands || ''} onChange={e => setForm({...form, past_brands: e.target.value})} placeholder="Nike, Apple, Samsung..." /> : <p style={{ color: 'var(--text-secondary)' }}>{kit?.past_brands || 'Add brands you\'ve worked with.'}</p>}
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 12 }}>Rates</h3>
            {editing ? <textarea className="form-textarea" value={form.rates || ''} onChange={e => setForm({...form, rates: e.target.value})} placeholder="Instagram Post: $500\nYouTube Video: $2000..." /> : <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{kit?.rates || 'Add your rate card.'}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

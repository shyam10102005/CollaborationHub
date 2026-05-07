import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Link2, Plus, Trash2, ExternalLink, BarChart3, GripVertical, Eye, X } from 'lucide-react';

export default function LinkInBio() {
  const { user, profile } = useAuth();
  const [links, setLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', url: '', icon: '🔗' });

  useEffect(() => { api.getBioLinks().then(setLinks).catch(() => {}); }, []);

  const addLink = async (e) => {
    e.preventDefault();
    await api.createBioLink(form);
    setForm({ title: '', url: '', icon: '🔗' });
    setShowModal(false);
    api.getBioLinks().then(setLinks);
  };

  const deleteLink = async (id) => { await api.deleteBioLink(id); api.getBioLinks().then(setLinks); };

  const totalClicks = links.reduce((sum, l) => sum + (l.click_count || 0), 0);
  const icons = ['🔗', '🌐', '📱', '🎬', '🎵', '📸', '🛍️', '📧', '💼', '🎨'];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1>Link-in-Bio</h1><p>Your customizable micro-landing page</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Link</button>
      </div>

      <div className="grid-2">
        {/* Preview */}
        <div>
          <h3 style={{ marginBottom: 16 }}>Preview</h3>
          <div className="card" style={{ maxWidth: 380, margin: '0 auto', padding: 32, textAlign: 'center', background: 'linear-gradient(180deg, rgba(139,92,246,0.1), var(--bg-card))' }}>
            <div className="avatar avatar-xl" style={{ margin: '0 auto 12px' }}>{user?.full_name?.[0]}</div>
            <h3 style={{ fontFamily: 'var(--font-display)' }}>{user?.full_name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 4 }}>@{profile?.username || 'username'}</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: 20 }}>{profile?.bio?.slice(0, 80) || 'Creator'}</p>
            <div style={{ display: 'grid', gap: 10 }}>
              {links.filter(l => l.is_active).map(l => (
                <a key={l.id} href={l.url} target="_blank" rel="noopener" style={{ display: 'block', padding: '12px 16px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem', transition: 'all 0.2s' }}>
                  {l.icon} {l.title}
                </a>
              ))}
            </div>
            <p style={{ marginTop: 20, fontSize: '0.7rem', color: 'var(--text-muted)' }}>Powered by CollaborationOS</p>
          </div>
        </div>

        {/* Manager */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3>Manage Links</h3>
            <div style={{ display: 'flex', gap: 16, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span><Eye size={14} style={{ verticalAlign: 'middle' }} /> {totalClicks} total clicks</span>
              <span>{links.length} links</span>
            </div>
          </div>
          {links.length === 0 ? (
            <div className="empty-state"><Link2 size={40} /><h3>No links yet</h3><p>Add your first link</p></div>
          ) : links.map(l => (
            <div key={l.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, padding: 14 }}>
              <span style={{ fontSize: '1.3rem' }}>{l.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{l.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.url}</div>
              </div>
              <span className="badge badge-info">{l.click_count || 0} clicks</span>
              <button className="btn btn-ghost btn-sm" onClick={() => deleteLink(l.id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}><h2>Add Link</h2><button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button></div>
            <form onSubmit={addLink}>
              <div className="form-group"><label>Icon</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {icons.map(i => <span key={i} onClick={() => setForm({...form, icon: i})} style={{ fontSize: '1.3rem', cursor: 'pointer', padding: 6, borderRadius: 6, border: form.icon === i ? '2px solid var(--accent)' : '2px solid transparent' }}>{i}</span>)}
                </div>
              </div>
              <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="My Website" required /></div>
              <div className="form-group"><label>URL</label><input className="form-input" value={form.url} onChange={e => setForm({...form, url: e.target.value})} placeholder="https://example.com" required /></div>
              <button className="btn btn-primary btn-lg" type="submit">Add Link</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

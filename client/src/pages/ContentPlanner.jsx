import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Plus, Calendar, Instagram, Youtube, Twitter, Video, Image, FileText, Trash2, Edit, X } from 'lucide-react';

const platformIcons = { instagram: Instagram, youtube: Youtube, twitter: Twitter, tiktok: Video, all: Calendar };
const statusColors = { draft: '#8888a4', scheduled: '#f59e0b', published: '#10b981', failed: '#ef4444' };

export default function ContentPlanner() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', content_type: 'post', platform: 'instagram', status: 'draft', scheduled_at: '', caption: '' });

  useEffect(() => { loadContent(); }, []);
  const loadContent = () => api.getContent().then(setItems).catch(() => {});

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.createContent(form);
    setShowModal(false);
    setForm({ title: '', content_type: 'post', platform: 'instagram', status: 'draft', scheduled_at: '', caption: '' });
    loadContent();
  };

  const handleDelete = async (id) => { await api.deleteContent(id); loadContent(); };
  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1>Content Planner</h1><p>Schedule and manage your content across platforms</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={18} /> New Content</button>
      </div>

      <div className="tabs">
        {['all', 'draft', 'scheduled', 'published'].map(t => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {filtered.length === 0 ? (
          <div className="empty-state"><Calendar size={48} /><h3>No content yet</h3><p>Create your first piece of content</p></div>
        ) : filtered.map(item => {
          const Icon = platformIcons[item.platform] || Calendar;
          return (
            <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${statusColors[item.status]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={statusColors[item.status]} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {item.platform} • {item.content_type} {item.scheduled_at && `• ${new Date(item.scheduled_at).toLocaleDateString()}`}
                </div>
              </div>
              <span className={`badge badge-${item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'warning' : 'info'}`}>{item.status}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2>Create Content</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="form-group"><label>Title</label><input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required /></div>
              <div className="grid-2">
                <div className="form-group"><label>Platform</label><select className="form-select" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})}><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="twitter">Twitter/X</option></select></div>
                <div className="form-group"><label>Type</label><select className="form-select" value={form.content_type} onChange={e => setForm({...form, content_type: e.target.value})}><option value="post">Post</option><option value="reel">Reel</option><option value="story">Story</option><option value="video">Video</option><option value="short">Short</option><option value="carousel">Carousel</option><option value="tweet">Tweet</option></select></div>
              </div>
              <div className="grid-2">
                <div className="form-group"><label>Status</label><select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}><option value="draft">Draft</option><option value="scheduled">Scheduled</option></select></div>
                <div className="form-group"><label>Schedule Date</label><input className="form-input" type="datetime-local" value={form.scheduled_at} onChange={e => setForm({...form, scheduled_at: e.target.value})} /></div>
              </div>
              <div className="form-group"><label>Caption</label><textarea className="form-textarea" value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} placeholder="Write your caption..." /></div>
              <button className="btn btn-primary btn-lg" type="submit">Create Content</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

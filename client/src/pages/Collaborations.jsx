import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Handshake, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

const statusMap = { pending: { color: '#f59e0b', badge: 'warning' }, accepted: { color: '#3b82f6', badge: 'info' }, in_creation: { color: '#8b5cf6', badge: 'accent' }, under_review: { color: '#06b6d4', badge: 'info' }, completed: { color: '#10b981', badge: 'success' }, rejected: { color: '#ef4444', badge: 'danger' }, cancelled: { color: '#8888a4', badge: 'info' } };

export default function Collaborations() {
  const { user } = useAuth();
  const [collabs, setCollabs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.getCollaborations().then(setCollabs).catch(() => {}).finally(() => setLoading(false)); }, []);

  const updateStatus = async (id, status) => {
    await api.updateCollabStatus(id, status);
    const updated = await api.getCollaborations();
    setCollabs(updated);
  };

  const filtered = filter === 'all' ? collabs : collabs.filter(c => c.status === filter);

  return (
    <div>
      <div className="page-header"><h1>Collaborations</h1><p>Manage brand deals and creator partnerships</p></div>
      <div className="tabs">
        {['all', 'pending', 'accepted', 'in_creation', 'completed'].map(t => (
          <button key={t} className={`tab ${filter === t ? 'active' : ''}`} onClick={() => setFilter(t)}>{t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div> : filtered.length === 0 ? (
        <div className="empty-state"><Handshake size={48} /><h3>No collaborations</h3><p>Your deals will appear here</p></div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filtered.map(c => (
            <div key={c.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{c.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{c.description}</p>
                </div>
                <span className={`badge badge-${statusMap[c.status]?.badge || 'info'}`}>{c.status.replace('_', ' ')}</span>
              </div>
              <div style={{ display: 'flex', gap: 24, fontSize: '0.85rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span>Type: <strong style={{ color: 'var(--text-primary)' }}>{c.type === 'brand_deal' ? 'Brand Deal' : 'Peer Collab'}</strong></span>
                {c.budget > 0 && <span>Budget: <strong style={{ color: 'var(--success)' }}>${c.budget.toLocaleString()}</strong></span>}
                <span>From: <strong style={{ color: 'var(--text-primary)' }}>{c.initiator_name}</strong></span>
                <span>To: <strong style={{ color: 'var(--text-primary)' }}>{c.receiver_name}</strong></span>
                {c.platform && <span>Platform: <strong style={{ color: 'var(--text-primary)' }}>{c.platform}</strong></span>}
              </div>
              {c.status === 'pending' && c.receiver_id === user?.id && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-success btn-sm" onClick={() => updateStatus(c.id, 'accepted')}><CheckCircle size={14} /> Accept</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(c.id, 'rejected')}><XCircle size={14} /> Reject</button>
                </div>
              )}
              {c.status === 'accepted' && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-primary btn-sm" onClick={() => updateStatus(c.id, 'in_creation')}>Start Work <ChevronRight size={14} /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

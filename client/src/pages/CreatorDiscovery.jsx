import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Search, Filter, MapPin, Users, TrendingUp, ExternalLink, MessageSquare } from 'lucide-react';

export default function CreatorDiscovery() {
  const [creators, setCreators] = useState([]);
  const [search, setSearch] = useState('');
  const [niche, setNiche] = useState('');
  const [sort, setSort] = useState('followers');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCreators(); }, [niche, sort]);

  const loadCreators = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (niche) params.set('niche', niche);
    if (sort) params.set('sort', sort);
    api.getCreators(params.toString()).then(setCreators).catch(() => {}).finally(() => setLoading(false));
  };

  const handleSearch = (e) => { e.preventDefault(); loadCreators(); };
  const niches = ['', 'Tech & Gaming', 'Fashion & Lifestyle', 'Fitness & Wellness', 'Food & Travel', 'Music & Entertainment', 'Beauty & Skincare', 'Photography & Art', 'Education & Motivation'];

  const formatNum = (n) => n >= 1000000 ? (n/1000000).toFixed(1)+'M' : n >= 1000 ? (n/1000).toFixed(0)+'K' : n;

  return (
    <div>
      <div className="page-header"><h1>Discover Creators</h1><p>Find the perfect collaboration partners with AI-powered search</p></div>

      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 200 }}>
            <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Search by name, niche, or keyword..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 180 }} value={niche} onChange={e => setNiche(e.target.value)}>
            <option value="">All Niches</option>
            {niches.filter(Boolean).map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <select className="form-select" style={{ width: 160 }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="followers">Most Followers</option>
            <option value="engagement">Top Engagement</option>
          </select>
          <button className="btn btn-primary" type="submit"><Search size={16} /> Search</button>
        </form>
      </div>

      {loading ? <div className="loading-screen" style={{ minHeight: 200 }}><div className="spinner" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {creators.map(c => (
            <div key={c.id} className="card" style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                <div className="avatar avatar-lg" style={{ background: `hsl(${c.full_name.charCodeAt(0)*20}, 60%, 50%)` }}>{c.full_name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{c.full_name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)' }}>@{c.username}</div>
                  {c.location && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}><MapPin size={12} /> {c.location}</div>}
                </div>
                {c.is_verified ? <span className="badge badge-success">Verified</span> : null}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>{c.bio}</p>
              <span className="badge badge-accent" style={{ marginBottom: 12 }}>{c.niche}</span>
              <div style={{ display: 'flex', gap: 24, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatNum(c.follower_count)}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Followers</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{c.engagement_rate}%</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Engagement</div></div>
                <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{formatNum(c.avg_views)}</div><div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Avg Views</div></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

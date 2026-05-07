import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  Shield, Users, Building2, Handshake, DollarSign, TrendingUp,
  Activity, AlertTriangle, CheckCircle, Clock, BarChart3, Eye,
  ArrowUpRight, ArrowDownRight, UserCheck, UserX, Globe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function ManagerDashboard() {
  const { user, profile } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [collabStats, setCollabStats] = useState(null);
  const [creators, setCreators] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    api.getEarningsSummary().then(setEarnings).catch(() => {});
    api.getCollabStats().then(setCollabStats).catch(() => {});
    api.getCreators().then(data => {
      setCreators(Array.isArray(data) ? data : data?.creators || []);
    }).catch(() => {});
  }, []);

  const totalCreators = creators.length;
  const verifiedCreators = creators.filter(c => c.is_verified).length;
  const totalFollowers = creators.reduce((sum, c) => sum + (c.follower_count || 0), 0);
  const avgEngagement = totalCreators > 0
    ? (creators.reduce((sum, c) => sum + (c.engagement_rate || 0), 0) / totalCreators).toFixed(2)
    : 0;

  const platformStats = [
    { label: 'Total Creators', value: totalCreators.toLocaleString(), change: '+8.2%', positive: true, icon: Users, color: '#8b5cf6' },
    { label: 'Platform Revenue', value: `$${(earnings?.total?.total_earnings || 0).toLocaleString()}`, change: '+24%', positive: true, icon: DollarSign, color: '#10b981' },
    { label: 'Active Deals', value: collabStats?.active || 0, change: '+12', positive: true, icon: Handshake, color: '#06b6d4' },
    { label: 'Avg Engagement', value: `${avgEngagement}%`, change: '+0.3%', positive: true, icon: TrendingUp, color: '#f59e0b' },
  ];

  const healthMetrics = [
    { label: 'Platform Uptime', value: '99.99%', icon: Activity, color: '#10b981', status: 'healthy' },
    { label: 'Verified Creators', value: `${verifiedCreators}/${totalCreators}`, icon: UserCheck, color: '#8b5cf6', status: 'normal' },
    { label: 'Pending Reviews', value: collabStats?.pending || 0, icon: Clock, color: '#f59e0b', status: (collabStats?.pending || 0) > 10 ? 'warning' : 'normal' },
    { label: 'Disputes', value: 0, icon: AlertTriangle, color: '#ef4444', status: 'healthy' },
  ];

  const nicheDistribution = {};
  creators.forEach(c => {
    const niche = c.niche || 'Other';
    nicheDistribution[niche] = (nicheDistribution[niche] || 0) + 1;
  });
  const nicheData = Object.entries(nicheDistribution).map(([name, value]) => ({ name, value }));

  const topCreators = [...creators]
    .sort((a, b) => (b.follower_count || 0) - (a.follower_count || 0))
    .slice(0, 5);

  return (
    <div className="manager-dashboard">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div className="manager-badge-header">
            <Shield size={16} /> Platform Admin
          </div>
        </div>
        <h1>Admin Dashboard</h1>
        <p>Platform-wide overview and administration controls</p>
      </div>

      {/* Platform Stats */}
      <div className="stats-grid">
        {platformStats.map((s, i) => (
          <div key={i} className="stat-card manager-stat-card">
            <div className="stat-icon" style={{ background: `${s.color}20` }}>
              <s.icon size={20} color={s.color} />
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {s.change && (
              <div className={`stat-change ${s.positive ? 'positive' : 'negative'}`}>
                {s.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {s.change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Health Metrics */}
      <div className="manager-health-grid">
        {healthMetrics.map((m, i) => (
          <div key={i} className="manager-health-card">
            <div className="health-indicator" data-status={m.status} />
            <m.icon size={18} color={m.color} />
            <div className="health-info">
              <div className="health-label">{m.label}</div>
              <div className="health-value">{m.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 24 }}>
        {/* Revenue Trend */}
        <div className="card">
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} color="var(--accent)" /> Platform Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={earnings?.monthly || []}>
              <defs>
                <linearGradient id="adminGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#55556a" fontSize={12} />
              <YAxis stroke="#55556a" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
              <Area type="monotone" dataKey="total" stroke="#10b981" fill="url(#adminGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Creator Niche Distribution */}
        <div className="card">
          <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="var(--accent)" /> Creator Distribution by Niche
          </h3>
          {nicheData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={nicheData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {nicheData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No creator data available</p></div>
          )}
        </div>
      </div>

      {/* Top Creators Table */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={18} color="var(--accent)" /> Top Creators by Reach
        </h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Creator</th>
                <th>Niche</th>
                <th>Followers</th>
                <th>Engagement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {topCreators.map((c, i) => (
                <tr key={i}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className="avatar" style={{ width: 32, height: 32, fontSize: '0.7rem' }}>
                      {(c.username || c.full_name || '?')[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>@{c.username || 'unknown'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.full_name || ''}</div>
                    </div>
                  </td>
                  <td><span className="badge badge-accent">{c.niche || 'N/A'}</span></td>
                  <td>{(c.follower_count || 0).toLocaleString()}</td>
                  <td>{c.engagement_rate || 0}%</td>
                  <td>
                    {c.is_verified
                      ? <span className="badge badge-success"><CheckCircle size={12} /> Verified</span>
                      : <span className="badge badge-warning"><Clock size={12} /> Pending</span>
                    }
                  </td>
                </tr>
              ))}
              {topCreators.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>No creators on the platform yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="manager-actions-grid" style={{ marginTop: 24 }}>
        <div className="manager-action-card" style={{ '--action-color': '#8b5cf6' }}>
          <Users size={24} />
          <h4>Manage Creators</h4>
          <p>Review profiles, verify accounts, manage creator access</p>
        </div>
        <div className="manager-action-card" style={{ '--action-color': '#06b6d4' }}>
          <Building2 size={24} />
          <h4>Manage Brands</h4>
          <p>Approve brand accounts, monitor campaigns & spending</p>
        </div>
        <div className="manager-action-card" style={{ '--action-color': '#10b981' }}>
          <DollarSign size={24} />
          <h4>Revenue Reports</h4>
          <p>Platform fees, payouts, and financial reconciliation</p>
        </div>
        <div className="manager-action-card" style={{ '--action-color': '#f59e0b' }}>
          <Shield size={24} />
          <h4>Platform Settings</h4>
          <p>Configure fees, policies, and platform parameters</p>
        </div>
      </div>
    </div>
  );
}

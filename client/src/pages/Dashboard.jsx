import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { TrendingUp, DollarSign, Handshake, Users, Eye, Calendar, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [collabStats, setCollabStats] = useState(null);
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    api.getEarningsSummary().then(setEarnings).catch(() => {});
    api.getCollabStats().then(setCollabStats).catch(() => {});
    if (user?.role === 'creator' && profile) {
      api.getCreatorStats(user.id).then(d => setGrowthData(d.followerGrowth || [])).catch(() => {});
    }
  }, [user, profile]);

  const stats = user?.role === 'creator' ? [
    { label: 'Followers', value: profile?.follower_count?.toLocaleString() || '0', change: '+12.5%', positive: true, icon: Users, color: '#8b5cf6' },
    { label: 'Engagement', value: `${profile?.engagement_rate || 0}%`, change: '+0.8%', positive: true, icon: TrendingUp, color: '#06b6d4' },
    { label: 'Total Earnings', value: `$${(earnings?.total?.total_earnings || 0).toLocaleString()}`, change: '+24%', positive: true, icon: DollarSign, color: '#10b981' },
    { label: 'Active Collabs', value: collabStats?.active || 0, change: '+2', positive: true, icon: Handshake, color: '#f59e0b' },
  ] : user?.role === 'brand' ? [
    { label: 'Active Campaigns', value: collabStats?.active || 0, icon: Handshake, color: '#8b5cf6' },
    { label: 'Total Spent', value: `$${(collabStats?.total_brand_value || 0).toLocaleString()}`, icon: DollarSign, color: '#06b6d4' },
    { label: 'Completed', value: collabStats?.completed || 0, icon: BarChart3, color: '#10b981' },
    { label: 'Pending', value: collabStats?.pending || 0, icon: Calendar, color: '#f59e0b' },
  ] : [
    { label: 'Total Deals', value: collabStats?.total || 0, icon: Handshake, color: '#8b5cf6' },
    { label: 'Revenue', value: `$${(earnings?.total?.total_earnings || 0).toLocaleString()}`, icon: DollarSign, color: '#06b6d4' },
    { label: 'Active', value: collabStats?.active || 0, icon: TrendingUp, color: '#10b981' },
    { label: 'Completed', value: collabStats?.completed || 0, icon: BarChart3, color: '#f59e0b' },
  ];

  const pieData = earnings?.byType?.map((t, i) => ({ name: t.type, value: t.total })) || [];

  return (
    <div>
      <div className="page-header">
        <h1>Welcome back, {user?.full_name?.split(' ')[0]} 👋</h1>
        <p>Here's your {user?.role} dashboard overview</p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
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

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>
            {user?.role === 'creator' ? 'Follower Growth' : 'Revenue Trend'}
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={growthData.length ? growthData : earnings?.monthly || []}>
              <defs>
                <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={growthData.length ? 'month' : 'month'} stroke="#55556a" fontSize={12} />
              <YAxis stroke="#55556a" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
              <Area type="monotone" dataKey={growthData.length ? 'followers' : 'total'} stroke="#8b5cf6" fill="url(#colorGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Earnings by Type</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state"><p>No earnings data yet</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

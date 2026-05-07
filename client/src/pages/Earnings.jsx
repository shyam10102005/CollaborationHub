import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { DollarSign, TrendingUp, Clock, CheckCircle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Earnings() {
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getEarningsSummary(), api.getEarnings()])
      .then(([s, e]) => { setSummary(s); setEarnings(e); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>;

  const stats = [
    { label: 'Total Earnings', value: `$${(summary?.total?.total_earnings || 0).toLocaleString()}`, icon: DollarSign, color: '#10b981' },
    { label: 'Paid Out', value: `$${(summary?.total?.paid_earnings || 0).toLocaleString()}`, icon: CheckCircle, color: '#8b5cf6' },
    { label: 'Pending', value: `$${(summary?.total?.pending_earnings || 0).toLocaleString()}`, icon: Clock, color: '#f59e0b' },
    { label: 'Transactions', value: summary?.total?.total_transactions || 0, icon: TrendingUp, color: '#06b6d4' },
  ];

  return (
    <div>
      <div className="page-header"><h1>Earnings Dashboard</h1><p>Track your revenue across all income streams</p></div>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: `${s.color}20` }}><s.icon size={20} color={s.color} /></div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary?.monthly || []}>
              <XAxis dataKey="month" stroke="#55556a" fontSize={12} />
              <YAxis stroke="#55556a" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
              <Bar dataKey="total" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: 20 }}>By Income Type</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {(summary?.byType || []).map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{t.type}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.count} transactions</div>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--success)' }}>${t.total.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 20 }}>Recent Transactions</h3>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Description</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {earnings.slice(0, 15).map(e => (
                <tr key={e.id}>
                  <td>{e.description || 'Payment'}</td>
                  <td><span className="badge badge-accent">{e.type}</span></td>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>${e.amount.toLocaleString()}</td>
                  <td><span className={`badge badge-${e.status === 'completed' ? 'success' : 'warning'}`}>{e.status}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{new Date(e.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

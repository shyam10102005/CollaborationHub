import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Save } from 'lucide-react';

export default function Settings() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>
      <div className="page-header"><h1>Settings</h1><p>Manage your account and preferences</p></div>

      <div className="tabs">
        {[['profile', 'Profile'], ['notifications', 'Notifications'], ['security', 'Security'], ['appearance', 'Appearance']].map(([k, v]) => (
          <button key={k} className={`tab ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{v}</button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: 20 }}>Profile Information</h3>
          <div className="form-group"><label>Full Name</label><input className="form-input" defaultValue={user?.full_name} /></div>
          <div className="form-group"><label>Email</label><input className="form-input" defaultValue={user?.email} type="email" /></div>
          <div className="form-group"><label>Role</label><input className="form-input" value={user?.role} disabled style={{ textTransform: 'capitalize', opacity: 0.7 }} /></div>
          {user?.role === 'creator' && (
            <>
              <div className="form-group"><label>Username</label><input className="form-input" defaultValue={profile?.username} /></div>
              <div className="form-group"><label>Bio</label><textarea className="form-textarea" defaultValue={profile?.bio} /></div>
              <div className="form-group"><label>Niche</label><input className="form-input" defaultValue={profile?.niche} /></div>
              <div className="form-group"><label>Location</label><input className="form-input" defaultValue={profile?.location} /></div>
            </>
          )}
          <button className="btn btn-primary"><Save size={16} /> Save Changes</button>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: 20 }}>Notification Preferences</h3>
          {['New collaboration requests', 'Messages received', 'Content published', 'Earnings updates', 'AI insights ready'].map((n, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <span>{n}</span>
              <label style={{ position: 'relative', width: 44, height: 24 }}>
                <input type="checkbox" defaultChecked style={{ opacity: 0, position: 'absolute' }} />
                <span style={{ position: 'absolute', inset: 0, background: 'var(--accent)', borderRadius: 12, cursor: 'pointer' }}><span style={{ position: 'absolute', width: 18, height: 18, background: 'white', borderRadius: '50%', top: 3, left: 3, transition: '0.2s' }} /></span>
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: 20 }}>Security Settings</h3>
          <div className="form-group"><label>Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          <div className="form-group"><label>New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          <div className="form-group"><label>Confirm New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          <button className="btn btn-primary"><Shield size={16} /> Update Password</button>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="card" style={{ maxWidth: 600 }}>
          <h3 style={{ marginBottom: 20 }}>Appearance</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>Theme</p>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ padding: 16, background: '#0a0a0f', border: '2px solid var(--accent)', borderRadius: 8, cursor: 'pointer', textAlign: 'center', flex: 1 }}>
              <Palette size={20} /><div style={{ fontSize: '0.8rem', marginTop: 4 }}>Dark</div>
            </div>
            <div style={{ padding: 16, background: '#f5f5f5', color: '#333', border: '2px solid var(--border)', borderRadius: 8, cursor: 'pointer', textAlign: 'center', flex: 1, opacity: 0.5 }}>
              <Palette size={20} /><div style={{ fontSize: '0.8rem', marginTop: 4 }}>Light (Soon)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

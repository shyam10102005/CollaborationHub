import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, Users, Handshake, DollarSign, Sparkles, MessageSquare, Link2, FileText, TrendingUp, Settings, LogOut, Building2, Shield, Activity } from 'lucide-react';

const creatorLinks = [
  { section: 'Overview', links: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/content-planner', icon: Calendar, label: 'Content Planner' },
    { to: '/ai-assistant', icon: Sparkles, label: 'AI Assistant' },
  ]},
  { section: 'Business', links: [
    { to: '/collaborations', icon: Handshake, label: 'Collaborations' },
    { to: '/earnings', icon: DollarSign, label: 'Earnings' },
    { to: '/media-kit', icon: FileText, label: 'Media Kit' },
  ]},
  { section: 'Connect', links: [
    { to: '/discover', icon: Users, label: 'Discover Creators' },
    { to: '/chat', icon: MessageSquare, label: 'Messages' },
    { to: '/link-in-bio', icon: Link2, label: 'Link-in-Bio' },
  ]},
];

const brandLinks = [
  { section: 'Overview', links: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/discover', icon: Users, label: 'Find Creators' },
  ]},
  { section: 'Campaigns', links: [
    { to: '/collaborations', icon: Handshake, label: 'Campaigns' },
    { to: '/chat', icon: MessageSquare, label: 'Messages' },
    { to: '/earnings', icon: DollarSign, label: 'Spending' },
  ]},
];

const managerLinks = [
  { section: 'Administration', links: [
    { to: '/manager/dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
    { to: '/manager/discover', icon: Users, label: 'All Creators' },
  ]},
  { section: 'Platform Ops', links: [
    { to: '/manager/collaborations', icon: Handshake, label: 'All Deals' },
    { to: '/manager/earnings', icon: DollarSign, label: 'Platform Revenue' },
    { to: '/manager/chat', icon: MessageSquare, label: 'Messages' },
  ]},
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isManager = user?.role === 'manager';

  const navSections = user?.role === 'brand' ? brandLinks : isManager ? managerLinks : creatorLinks;
  const settingsPath = isManager ? '/manager/settings' : '/settings';

  const handleLogout = () => {
    logout();
    navigate(isManager ? '/manager/login' : '/');
  };

  return (
    <aside className={`sidebar ${isManager ? 'sidebar-admin' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">CollaborationHub</div>
        {isManager && (
          <div className="sidebar-admin-badge">
            <Shield size={12} /> Admin Portal
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.section} className="sidebar-section">
            <div className="sidebar-section-title">{section.section}</div>
            {section.links.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="sidebar-section">
          <div className="sidebar-section-title">System</div>
          <NavLink to={settingsPath} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={18} /> Settings
          </NavLink>
        </div>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className={`avatar ${isManager ? 'avatar-admin' : ''}`}>{user?.full_name?.[0] || 'U'}</div>
          <div className="sidebar-user-info">
            <div className="name">{user?.full_name}</div>
            <div className="role">{isManager ? '⚡ Platform Admin' : user?.role}</div>
          </div>
        </div>
        <button className="nav-link" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', marginTop: 4 }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}


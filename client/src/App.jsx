import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import HelpButton from './components/HelpButton';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ContentPlanner from './pages/ContentPlanner';
import CreatorDiscovery from './pages/CreatorDiscovery';
import Collaborations from './pages/Collaborations';
import Earnings from './pages/Earnings';
import MediaKit from './pages/MediaKit';
import AIAssistant from './pages/AIAssistant';
import Chat from './pages/Chat';
import LinkInBio from './pages/LinkInBio';
import Settings from './pages/Settings';
import ManagerLogin from './pages/ManagerLogin';
import ManagerDashboard from './pages/ManagerDashboard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function ManagerRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/manager/login" />;
  if (user.role !== 'manager') return <Navigate to="/dashboard" />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
      <HelpButton />
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <Routes>
      <Route path="/" element={user ? (user.role === 'manager' ? <Navigate to="/manager/dashboard" /> : <Navigate to="/dashboard" />) : <Landing />} />
      <Route path="/login" element={user ? (user.role === 'manager' ? <Navigate to="/manager/dashboard" /> : <Navigate to="/dashboard" />) : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <Signup />} />

      {/* Manager Admin Routes */}
      <Route path="/manager/login" element={user?.role === 'manager' ? <Navigate to="/manager/dashboard" /> : <ManagerLogin />} />
      <Route path="/manager/dashboard" element={
        <ManagerRoute>
          <AppLayout><ManagerDashboard /></AppLayout>
        </ManagerRoute>
      } />
      {['discover', 'collaborations', 'earnings', 'chat', 'settings'].map(path => (
        <Route key={`mgr-${path}`} path={`/manager/${path}`} element={
          <ManagerRoute>
            <AppLayout>
              {path === 'discover' && <CreatorDiscovery />}
              {path === 'collaborations' && <Collaborations />}
              {path === 'earnings' && <Earnings />}
              {path === 'chat' && <Chat />}
              {path === 'settings' && <Settings />}
            </AppLayout>
          </ManagerRoute>
        } />
      ))}

      {/* Regular User Routes */}
      {['dashboard','content-planner','discover','collaborations','earnings','media-kit','ai-assistant','chat','link-in-bio','settings'].map(path => (
        <Route key={path} path={`/${path}`} element={
          <ProtectedRoute>
            <AppLayout>
              {path === 'dashboard' && <Dashboard />}
              {path === 'content-planner' && <ContentPlanner />}
              {path === 'discover' && <CreatorDiscovery />}
              {path === 'collaborations' && <Collaborations />}
              {path === 'earnings' && <Earnings />}
              {path === 'media-kit' && <MediaKit />}
              {path === 'ai-assistant' && <AIAssistant />}
              {path === 'chat' && <Chat />}
              {path === 'link-in-bio' && <LinkInBio />}
              {path === 'settings' && <Settings />}
            </AppLayout>
          </ProtectedRoute>
        } />
      ))}
    </Routes>
  );
}


import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Users, DollarSign, MessageSquare, TrendingUp, Zap, Shield, BarChart3, Link2, FileText, Brain, Handshake, Split } from 'lucide-react';

const features = [
  { icon: Calendar, title: 'Content Planner', desc: 'Cross-platform scheduling with drag-and-drop calendar. Supports Instagram, YouTube, TikTok & X.', color: '#8b5cf6' },
  { icon: Sparkles, title: 'AI Content Assistant', desc: 'Generate captions, hashtags & content ideas powered by local AI models via Ollama.', color: '#06b6d4' },
  { icon: Users, title: 'Creator Discovery', desc: 'Find perfect collaboration partners with AI-powered semantic search & vector matching.', color: '#10b981' },
  { icon: Handshake, title: 'Brand Collaboration Hub', desc: 'Full CRM for managing brand deals, deliverables, contracts & campaign tracking.', color: '#f59e0b' },
  { icon: DollarSign, title: 'Earnings Dashboard', desc: 'Track sponsorship revenue, affiliate commissions & platform earnings with visual analytics.', color: '#ef4444' },
  { icon: FileText, title: 'Media Kit Generator', desc: 'Auto-generate dynamic media kits with verified real-time metrics from your social APIs.', color: '#8b5cf6' },
  { icon: MessageSquare, title: 'Real-Time Chat', desc: 'WebSocket-powered messaging for collaboration planning with file sharing support.', color: '#3b82f6' },
  { icon: Link2, title: 'Smart Link-in-Bio', desc: 'Customizable micro-landing page with click analytics, referral tracking & geo data.', color: '#06b6d4' },
  { icon: TrendingUp, title: 'AI Growth Insights', desc: 'Predictive analytics for optimal posting times, content strategy & audience growth.', color: '#10b981' },
  { icon: Split, title: 'Split Earnings', desc: 'Automated revenue splitting for multi-creator campaigns via Stripe Connect.', color: '#f59e0b' },
  { icon: Brain, title: 'AI Collab Suggestions', desc: 'Smart matching algorithm that minimizes audience overlap & maximizes reach.', color: '#ef4444' },
  { icon: Shield, title: 'Enterprise Security', desc: 'Role-based access control, JWT authentication & encrypted data at rest.', color: '#3b82f6' },
];

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">CollaborationOS</div>
        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#roles">For Teams</a>
          <Link to="/login" className="btn btn-ghost" style={{ color: 'var(--text-primary)' }}>Sign In</Link>
          <Link to="/signup" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', padding: '10px 24px', fontWeight: 600, boxShadow: '0 0 20px rgba(139,92,246,0.4)' }}>Get Started</Link>
        </div>
      </nav>

      <section className="landing-hero">
        <h1>The Operating System for <span>Content Creators</span></h1>
        <p>Unify your content, collaborations, and earnings in one AI-powered platform. Built for creators, brands, and platform managers.</p>
        <div className="hero-btns">
          <Link to="/signup" className="btn btn-primary btn-lg">Start Free Trial <Zap size={18} /></Link>
          <a href="#features" className="btn btn-secondary btn-lg">Explore Features</a>
        </div>
        <div style={{ marginTop: 48, display: 'flex', gap: 48, justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <div><strong style={{ color: 'var(--text-primary)', fontSize: '1.5rem', display: 'block' }}>25K+</strong>Active Creators</div>
          <div><strong style={{ color: 'var(--text-primary)', fontSize: '1.5rem', display: 'block' }}>$5M+</strong>Monthly GMV</div>
          <div><strong style={{ color: 'var(--text-primary)', fontSize: '1.5rem', display: 'block' }}>99.99%</strong>Uptime</div>
        </div>
      </section>

      <section id="features" className="features-section">
        <h2>14 Integrated Modules. One Platform.</h2>
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: `${f.color}20` }}>
                <f.icon size={24} color={f.color} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="roles" className="features-section" style={{ background: 'var(--bg-secondary)' }}>
        <h2>Built for Every Role</h2>
        <div className="features-grid" style={{ maxWidth: 900 }}>
          {[
            { title: 'Creators', desc: 'Full content management, AI assistant, earnings tracking, and collaboration tools.', icon: Users, color: '#8b5cf6' },
            { title: 'Brands', desc: 'Campaign CRM, creator discovery with verified metrics, and escrow payments.', icon: BarChart3, color: '#06b6d4' },
            { title: 'Managers', desc: 'Platform administration dashboard to oversee creators, brands, and all CollaborationOS operations.', icon: Shield, color: '#10b981' },
          ].map((r, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon" style={{ background: `${r.color}20` }}><r.icon size={24} color={r.color} /></div>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 CollaborationOS. All rights reserved. Built with ❤️ for the creator economy.</p>
      </footer>
    </div>
  );
}

import { useState } from 'react';
import { HelpCircle, X, Shield, CheckCircle, Star, MessageSquare, FileText, Zap } from 'lucide-react';

const faqs = [
  {
    icon: Shield,
    title: 'How to Get Verified',
    content: `To get verified on CollaborationOS, you need to meet the following criteria:\n\n• Have at least 10,000 followers across your connected platforms\n• Complete your full profile (bio, niche, location)\n• Connect at least one social media account (Instagram, YouTube, or TikTok)\n• Have an active Media Kit with real engagement data\n• Maintain a consistent posting history (at least 10 published posts)\n\nOnce you meet these requirements, a "Request Verification" button will appear in your Settings page. Our team reviews requests within 48 hours.`
  },
  {
    icon: Star,
    title: 'Getting Started as a Creator',
    content: `1. Sign up and select "Creator" as your role\n2. Complete your profile with your niche and bio\n3. Connect your social media accounts in Settings\n4. Set up your Media Kit with your rates and portfolio\n5. Create your Link-in-Bio page\n6. Start using the Content Planner to schedule posts\n7. Explore the Creator Discovery to find collaboration partners`
  },
  {
    icon: FileText,
    title: 'Getting Started as a Brand',
    content: `1. Sign up and select "Brand" as your role\n2. Complete your company profile and industry\n3. Browse the Creator Discovery to find relevant creators\n4. Send collaboration requests with your campaign details\n5. Track campaigns and deliverables in the Collaborations tab\n6. Monitor spending in the Earnings dashboard`
  },
  {
    icon: Zap,
    title: 'Using the AI Assistant',
    content: `The AI Assistant helps you create content faster:\n\n• Content Generator: Write captions for any platform\n• Hashtag Generator: Get relevant hashtags for your niche\n• Growth Insights: Get AI-powered analytics and recommendations\n\nThe AI adapts to your platform and tone preferences.`
  },
  {
    icon: MessageSquare,
    title: 'How Collaborations Work',
    content: `Collaboration lifecycle:\n\n1. Pending → Request sent, waiting for response\n2. Accepted → Both parties agree on terms\n3. In Creation → Content is being produced\n4. Under Review → Deliverables submitted for review\n5. Completed → Content approved and published\n\nFor brand deals, payments are tracked in the Earnings dashboard.`
  },
];

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
          border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(139,92,246,0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={e => { e.target.style.transform = 'scale(1.1)'; }}
        onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
        title="Help & FAQ"
      >
        <HelpCircle size={26} color="white" />
      </button>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)} style={{ zIndex: 1001 }}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520, maxHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HelpCircle size={22} color="var(--accent)" /> Help Center
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gap: 8 }}>
              {faqs.map((faq, i) => (
                <div key={i}>
                  <button
                    onClick={() => setActiveIdx(activeIdx === i ? null : i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '14px 16px',
                      background: activeIdx === i ? 'rgba(139,92,246,0.1)' : 'var(--bg-card)',
                      border: `1px solid ${activeIdx === i ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 8, cursor: 'pointer', display: 'flex',
                      alignItems: 'center', gap: 12, color: 'var(--text-primary)',
                      fontFamily: 'var(--font-primary)', fontSize: '0.9rem', fontWeight: 600,
                      transition: 'all 0.2s',
                    }}
                  >
                    <faq.icon size={18} color={activeIdx === i ? 'var(--accent)' : 'var(--text-secondary)'} />
                    {faq.title}
                    <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      {activeIdx === i ? '−' : '+'}
                    </span>
                  </button>
                  {activeIdx === i && (
                    <div style={{
                      padding: '16px 16px 16px 46px', background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)', borderTop: 'none',
                      borderRadius: '0 0 8px 8px', whiteSpace: 'pre-line',
                      fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)',
                    }}>
                      {faq.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, padding: 16, background: 'rgba(139,92,246,0.08)', borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Need more help?</strong><br />
              Email us at <a href="mailto:support@collaborationos.com" style={{ color: 'var(--accent)' }}>support@collaborationos.com</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

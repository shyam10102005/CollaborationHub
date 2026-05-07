import { useState } from 'react';
import { api } from '../utils/api';
import { Sparkles, Send, Hash, Lightbulb, TrendingUp, Copy, Check, Loader2 } from 'lucide-react';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [type, setType] = useState('caption');
  const [result, setResult] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const data = await api.aiGenerate({ prompt, platform, type });
      setResult(data.content);
    } catch (e) { setResult('Error generating content. Please try again.'); }
    setLoading(false);
  };

  const genHashtags = async () => {
    setLoading(true);
    try {
      const data = await api.aiHashtags({ topic: prompt || 'content creation', platform, count: 20 });
      setHashtags(data.hashtags);
    } catch (e) {}
    setLoading(false);
  };

  const getInsights = async () => {
    setLoading(true);
    try {
      const data = await api.aiGrowthInsights();
      setInsights(data.insights);
    } catch (e) {}
    setLoading(false);
  };

  const copyText = (text) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const impactColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };

  return (
    <div>
      <div className="page-header"><h1>AI Assistant <Sparkles size={24} style={{ color: 'var(--accent)' }} /></h1><p>Generate content, hashtags & growth insights powered by AI</p></div>

      <div className="tabs">
        {[['generate', 'Content Generator'], ['hashtags', 'Hashtag Generator'], ['insights', 'Growth Insights']].map(([k, v]) => (
          <button key={k} className={`tab ${activeTab === k ? 'active' : ''}`} onClick={() => setActiveTab(k)}>{v}</button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Generate Content</h3>
            <div className="grid-2">
              <div className="form-group"><label>Platform</label><select className="form-select" value={platform} onChange={e => setPlatform(e.target.value)}><option value="instagram">Instagram</option><option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="twitter">Twitter/X</option></select></div>
              <div className="form-group"><label>Type</label><select className="form-select" value={type} onChange={e => setType(e.target.value)}><option value="caption">Caption</option><option value="idea">Content Idea</option></select></div>
            </div>
            <div className="form-group"><label>Describe your content</label><textarea className="form-textarea" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., New tech product review for my gaming audience..." style={{ minHeight: 120 }} /></div>
            <button className="btn btn-primary" onClick={generate} disabled={loading}>{loading ? <><Loader2 size={16} className="spin" /> Generating...</> : <><Sparkles size={16} /> Generate</>}</button>
          </div>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Result</h3>
              {result && <button className="btn btn-ghost btn-sm" onClick={() => copyText(result)}>{copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy'}</button>}
            </div>
            {result ? <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.9rem', padding: 16, background: 'var(--bg-primary)', borderRadius: 8 }}>{result}</div> : <div className="empty-state"><Sparkles size={40} /><p>Your AI-generated content will appear here</p></div>}
          </div>
        </div>
      )}

      {activeTab === 'hashtags' && (
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Hashtag Generator</h3>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <input className="form-input" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Enter topic (e.g., fitness, cooking, tech)..." style={{ flex: 1 }} />
            <button className="btn btn-primary" onClick={genHashtags} disabled={loading}><Hash size={16} /> Generate</button>
          </div>
          {hashtags.length > 0 && (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {hashtags.map((h, i) => <span key={i} className="badge badge-accent" style={{ cursor: 'pointer' }} onClick={() => copyText(h)}>{h}</span>)}
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => copyText(hashtags.join(' '))}><Copy size={14} /> Copy All</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'insights' && (
        <div>
          <button className="btn btn-primary" onClick={getInsights} disabled={loading} style={{ marginBottom: 20 }}><TrendingUp size={16} /> {loading ? 'Analyzing...' : 'Get AI Insights'}</button>
          <div style={{ display: 'grid', gap: 16 }}>
            {insights.map((ins, i) => (
              <div key={i} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3>{ins.title}</h3>
                  <span className="badge" style={{ background: `${impactColor[ins.impact]}20`, color: impactColor[ins.impact] }}>{ins.impact} impact</span>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 12, fontSize: '0.9rem' }}>{ins.insight}</p>
                <div style={{ padding: 12, background: 'rgba(139,92,246,0.08)', borderRadius: 8, fontSize: '0.85rem' }}>💡 <strong>Action:</strong> {ins.action}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, Search } from 'lucide-react';

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [creators, setCreators] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => { api.getConversations().then(setConversations).catch(() => {}); }, []);
  useEffect(() => { if (activeConv) { api.getMessages(activeConv.id).then(setMessages).catch(() => {}); } }, [activeConv]);
  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeConv) return;
    await api.sendMessage(activeConv.id, newMsg);
    setNewMsg('');
    const msgs = await api.getMessages(activeConv.id);
    setMessages(msgs);
  };

  const startNewChat = async () => {
    const data = await api.getCreators();
    setCreators(data);
    setShowNew(true);
  };

  const selectUser = async (userId) => {
    const conv = await api.createConversation(userId);
    setActiveConv(conv);
    setShowNew(false);
    const convs = await api.getConversations();
    setConversations(convs);
  };

  const getOtherName = (c) => c.participant_1 === user?.id ? c.participant_2_name : c.participant_1_name;
  const getOtherRole = (c) => c.participant_1 === user?.id ? c.participant_2_role : c.participant_1_role;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 48px)', gap: 0 }}>
      {/* Sidebar */}
      <div style={{ width: 300, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Messages</h3>
          <button className="btn btn-primary btn-sm" onClick={startNewChat}>+ New</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No conversations yet</div>
          ) : conversations.map(c => (
            <div key={c.id} onClick={() => { setActiveConv(c); setShowNew(false); }}
              style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: activeConv?.id === c.id ? 'var(--bg-card)' : 'transparent', transition: 'background 0.2s' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>{getOtherName(c)?.[0]}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{getOtherName(c)}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.last_message || 'No messages yet'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {showNew ? (
          <div style={{ padding: 24 }}>
            <h3 style={{ marginBottom: 16 }}>Start a new conversation</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {creators.map(c => (
                <div key={c.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 12 }} onClick={() => selectUser(c.user_id)}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>{c.full_name[0]}</div>
                  <div><div style={{ fontWeight: 600 }}>{c.full_name}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.niche}</div></div>
                </div>
              ))}
            </div>
          </div>
        ) : !activeConv ? (
          <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <MessageSquare size={48} /><h3>Select a conversation</h3><p>Choose a chat or start a new one</p>
          </div>
        ) : (
          <>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="avatar" style={{ width: 36, height: 36, fontSize: '0.8rem' }}>{getOtherName(activeConv)?.[0]}</div>
              <div><div style={{ fontWeight: 600 }}>{getOtherName(activeConv)}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{getOtherRole(activeConv)}</div></div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.sender_id === user?.id ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '70%', padding: '10px 16px', borderRadius: 12, background: m.sender_id === user?.id ? 'var(--accent)' : 'var(--bg-card)', color: m.sender_id === user?.id ? 'white' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {m.content}
                    <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: 4 }}>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEnd} />
            </div>
            <form onSubmit={sendMessage} style={{ padding: 16, borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <input className="form-input" value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Type a message..." style={{ flex: 1 }} />
              <button className="btn btn-primary" type="submit"><Send size={16} /></button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import styles from "../dashboard.module.css";

const rooms = [
  { id: "1", name: "Alex Rivera", lastMsg: "Sounds great! Let's shoot Wednesday", time: "2m ago", unread: 2 },
  { id: "2", name: "Nike Campaign Team", lastMsg: "The deliverable looks perfect ✨", time: "15m ago", unread: 0 },
  { id: "3", name: "Mia Chen", lastMsg: "I'll send the script tonight", time: "1h ago", unread: 1 },
  { id: "4", name: "Adobe Brand Team", lastMsg: "Budget approved for Q3", time: "3h ago", unread: 0 },
];

const chatMessages = [
  { id: "1", sender: "Alex Rivera", content: "Hey! I saw your latest Reel — the editing was insane 🔥", time: "10:30 AM", self: false },
  { id: "2", sender: "You", content: "Thanks! I used a new transition technique. Want to collab on something similar?", time: "10:32 AM", self: true },
  { id: "3", sender: "Alex Rivera", content: "Absolutely! I was thinking a fitness x lifestyle crossover. My audience would love that.", time: "10:35 AM", self: false },
  { id: "4", sender: "You", content: "Perfect. I can handle the edit and we split the brand deal 60/40? I'll set up the collab planner.", time: "10:38 AM", self: true },
  { id: "5", sender: "Alex Rivera", content: "Sounds great! Let's shoot Wednesday", time: "10:40 AM", self: false },
];

export default function ChatPage() {
  const [activeRoom, setActiveRoom] = useState("1");
  const [message, setMessage] = useState("");

  return (
    <div className="animate-fade-in" style={{ height: "calc(100vh - var(--header-height) - var(--space-xl) * 2)", display: "flex", flexDirection: "column" }}>
      <div className={styles.pageHeader} style={{ marginBottom: "var(--space-md)" }}>
        <h1 className={styles.pageTitle}>💬 Chat</h1>
        <p className={styles.pageSubtitle}>Real-time messaging with collaborators and brands</p>
      </div>

      <div className="glass-card" style={{ flex: 1, display: "grid", gridTemplateColumns: "280px 1fr", overflow: "hidden" }}>
        {/* Room List */}
        <div style={{ borderRight: "1px solid var(--border-subtle)", overflow: "auto" }}>
          {rooms.map((room) => (
            <div key={room.id} onClick={() => setActiveRoom(room.id)} style={{
              padding: "var(--space-md)",
              cursor: "pointer",
              borderBottom: "1px solid var(--border-subtle)",
              background: activeRoom === room.id ? "rgba(108, 92, 231, 0.1)" : "transparent",
              transition: "background var(--transition-fast)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "var(--font-size-sm)", flexShrink: 0 }}>
                  {room.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>{room.name}</span>
                    <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{room.time}</span>
                  </div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{room.lastMsg}</div>
                </div>
                {room.unread > 0 && <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--brand-primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700 }}>{room.unread}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Messages */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "var(--space-md)", borderBottom: "1px solid var(--border-subtle)", fontWeight: 700 }}>
            {rooms.find((r) => r.id === activeRoom)?.name}
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{ display: "flex", justifyContent: msg.self ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "65%", padding: "var(--space-sm) var(--space-md)",
                  borderRadius: "var(--radius-lg)",
                  background: msg.self ? "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))" : "var(--bg-glass)",
                  border: msg.self ? "none" : "1px solid var(--border-subtle)",
                  fontSize: "var(--font-size-sm)",
                }}>
                  <div>{msg.content}</div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: msg.self ? "rgba(255,255,255,0.6)" : "var(--text-muted)", marginTop: "var(--space-xs)", textAlign: "right" }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: "var(--space-md)", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-sm)" }}>
            <input id="chat-message-input" className="input" style={{ flex: 1 }} placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

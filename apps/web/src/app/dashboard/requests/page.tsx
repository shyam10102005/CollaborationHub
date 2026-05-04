"use client";
import React from "react";
import styles from "../dashboard.module.css";

const requests = [
  { id: "1", from: "Alex Rivera", type: "Joint Reel", platforms: ["Instagram"], status: "pending", date: "May 2, 2026", message: "Hey! Want to do a fitness x lifestyle Reel collab?" },
  { id: "2", from: "Mia Chen", type: "Tech Review Collab", platforms: ["YouTube"], status: "accepted", date: "Apr 28, 2026", message: "Let's review the new Creator Pro device together!" },
  { id: "3", from: "Sofia Martinez", type: "Recipe Series", platforms: ["Instagram", "TikTok"], status: "pending", date: "May 1, 2026", message: "3-part fusion cooking series — your audience will love it!" },
];

export default function RequestsPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📨 Collaboration Requests</h1>
        <p className={styles.pageSubtitle}>Manage incoming and outgoing collaboration invites</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {requests.map((req, i) => (
          <div key={req.id} className="glass-card" style={{ padding: "var(--space-lg)", animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>{req.from[0]}</div>
                <div>
                  <div style={{ fontWeight: 700 }}>{req.from}</div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{req.type} • {req.date}</div>
                </div>
              </div>
              <span className={`badge ${req.status === "accepted" ? "badge-success" : "badge-warning"}`}>{req.status}</span>
            </div>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-md)" }}>{req.message}</p>
            <div style={{ display: "flex", gap: "var(--space-sm)", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "var(--space-xs)" }}>
                {req.platforms.map((p) => <span key={p} className="badge badge-primary">{p}</span>)}
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: "var(--space-sm)" }}>
                {req.status === "pending" && <>
                  <button className="btn btn-primary btn-sm">✓ Accept</button>
                  <button className="btn btn-ghost btn-sm">✗ Decline</button>
                </>}
                {req.status === "accepted" && <button className="btn btn-secondary btn-sm">Open Workspace</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import React from "react";
import styles from "../dashboard.module.css";

export default function MediaKitPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 className={styles.pageTitle}>📊 Media Kit</h1>
            <p className={styles.pageSubtitle}>Auto-generated, API-verified media kit with real-time data</p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <button className="btn btn-secondary">🔗 Copy Share Link</button>
            <button className="btn btn-primary">📄 Export PDF</button>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: "var(--space-2xl)", maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))", margin: "0 auto var(--space-md)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.5rem", color: "white" }}>C</div>
          <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800 }}>Creator Name</h2>
          <p style={{ color: "var(--text-muted)", marginTop: "var(--space-xs)" }}>Lifestyle & Tech Content Creator</p>
          <div style={{ display: "flex", gap: "var(--space-sm)", justifyContent: "center", marginTop: "var(--space-md)" }}>
            <span className="badge badge-primary">🔒 API Verified</span>
            <span className="badge badge-success">Last updated: 2 hours ago</span>
          </div>
        </div>

        {/* Audience Stats */}
        <h3 style={{ fontWeight: 700, marginBottom: "var(--space-md)", fontSize: "var(--font-size-lg)" }}>Audience Overview</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-md)", marginBottom: "var(--space-2xl)" }}>
          {[
            { platform: "Instagram", followers: "125.4K", engagement: "4.8%", icon: "📸" },
            { platform: "YouTube", followers: "89.2K", engagement: "6.2%", icon: "🎬" },
            { platform: "TikTok", followers: "34.1K", engagement: "8.1%", icon: "🎵" },
          ].map((p) => (
            <div key={p.platform} style={{ padding: "var(--space-lg)", background: "var(--bg-glass)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", textAlign: "center" }}>
              <span style={{ fontSize: "1.5rem" }}>{p.icon}</span>
              <div style={{ fontWeight: 700, fontSize: "var(--font-size-2xl)", marginTop: "var(--space-sm)" }}>{p.followers}</div>
              <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>{p.platform}</div>
              <div style={{ marginTop: "var(--space-sm)", fontSize: "var(--font-size-sm)", color: "var(--brand-success)", fontWeight: 600 }}>
                {p.engagement} engagement
              </div>
            </div>
          ))}
        </div>

        {/* Past Collaborations */}
        <h3 style={{ fontWeight: 700, marginBottom: "var(--space-md)", fontSize: "var(--font-size-lg)" }}>Past Collaborations</h3>
        <div style={{ display: "flex", gap: "var(--space-md)", flexWrap: "wrap", marginBottom: "var(--space-2xl)" }}>
          {["Nike", "Adobe", "Samsung", "Spotify", "Canva"].map((brand) => (
            <div key={brand} style={{ padding: "var(--space-sm) var(--space-lg)", background: "var(--bg-glass)", borderRadius: "var(--radius-full)", border: "1px solid var(--border-subtle)", fontSize: "var(--font-size-sm)", fontWeight: 600 }}>
              {brand}
            </div>
          ))}
        </div>

        {/* Rates */}
        <h3 style={{ fontWeight: 700, marginBottom: "var(--space-md)", fontSize: "var(--font-size-lg)" }}>Rate Card</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
          {[
            { type: "Instagram Reel", rate: "$2,500" },
            { type: "YouTube Integration", rate: "$5,000" },
            { type: "Instagram Story Set", rate: "$1,200" },
            { type: "TikTok Video", rate: "$1,800" },
          ].map((r) => (
            <div key={r.type} style={{ display: "flex", justifyContent: "space-between", padding: "var(--space-md)", background: "var(--bg-glass)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <span style={{ fontSize: "var(--font-size-sm)" }}>{r.type}</span>
              <span style={{ fontWeight: 700, color: "var(--brand-success)" }}>{r.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

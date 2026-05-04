"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";

const sampleLinks = [
  { id: "1", title: "Latest YouTube Video", url: "https://youtube.com/watch?v=demo", icon: "🎬", clicks: 1847 },
  { id: "2", title: "Instagram Profile", url: "https://instagram.com/creator", icon: "📸", clicks: 3291 },
  { id: "3", title: "Merch Store", url: "https://store.example.com", icon: "🛍️", clicks: 892 },
  { id: "4", title: "Book a Collab", url: "https://calendly.com/creator", icon: "📅", clicks: 456 },
  { id: "5", title: "Join Discord", url: "https://discord.gg/creator", icon: "💬", clicks: 2103 },
];

const analyticsData = [
  { label: "Total Clicks", value: "8,589", change: "+18.2%" },
  { label: "Unique Visitors", value: "5,234", change: "+12.5%" },
  { label: "Avg CTR", value: "34.2%", change: "+3.1%" },
  { label: "Top Referrer", value: "Instagram", change: "62%" },
];

export default function LinkInBioPage() {
  const [links] = useState(sampleLinks);

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🔗 Link-in-Bio</h1>
        <p className={styles.pageSubtitle}>Manage your digital portfolio and track performance</p>
      </div>

      {/* Analytics */}
      <div className={styles.statsGrid}>
        {analyticsData.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change positive">{stat.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)" }}>
        {/* Link Editor */}
        <div>
          <h2 className={styles.sectionTitle}>Your Links</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
            {links.map((link, i) => (
              <div key={link.id} className="glass-card" style={{
                padding: "var(--space-md)",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-md)",
                animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
              }}>
                <span style={{ fontSize: "1.5rem", cursor: "grab" }}>⠿</span>
                <span style={{ fontSize: "1.5rem" }}>{link.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>{link.title}</div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{link.url}</div>
                </div>
                <span className="badge badge-primary">{link.clicks.toLocaleString()} clicks</span>
                <button className="btn btn-ghost btn-sm">✏️</button>
              </div>
            ))}
            <button className="btn btn-secondary" style={{ marginTop: "var(--space-sm)" }}>+ Add Link</button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <h2 className={styles.sectionTitle}>Preview</h2>
          <div className="glass-card" style={{
            padding: "var(--space-xl)",
            textAlign: "center",
            maxWidth: "360px",
            margin: "0 auto",
          }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))",
              margin: "0 auto var(--space-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "white",
            }}>C</div>
            <h3 style={{ fontWeight: 700, marginBottom: "var(--space-xs)" }}>@creator</h3>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)", marginBottom: "var(--space-lg)" }}>
              Content Creator • 248K Followers
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
              {links.map((link) => (
                <div key={link.id} style={{
                  padding: "12px",
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--font-size-sm)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all var(--transition-fast)",
                }}>
                  {link.icon} {link.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

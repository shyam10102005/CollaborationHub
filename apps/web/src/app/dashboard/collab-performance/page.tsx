"use client";
import React from "react";
import styles from "../dashboard.module.css";

export default function CollabPerformancePage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🎯 Collab Performance</h1>
        <p className={styles.pageSubtitle}>Track cross-creator metrics and collaboration ROI</p>
      </div>
      <div className={styles.statsGrid}>
        {[
          { label: "Total Collabs", value: "12", change: "+4 this quarter" },
          { label: "Combined Reach", value: "2.1M", change: "+340K" },
          { label: "New Followers Gained", value: "18.4K", change: "From collabs" },
          { label: "Avg ROI", value: "3.2x", change: "+0.5x" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change positive">{s.change}</div>
          </div>
        ))}
      </div>
      <h2 className={styles.sectionTitle}>Recent Collaboration Results</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {[
          { partner: "Alex Rivera", type: "Joint Reel", reach: "485K", engagement: "6.2%", newFollowers: "3,200", roi: "4.1x" },
          { partner: "Mia Chen", type: "Tech Review", reach: "312K", engagement: "5.8%", newFollowers: "2,100", roi: "3.5x" },
          { partner: "Yuki Tanaka", type: "Cross-post", reach: "228K", engagement: "7.4%", newFollowers: "4,800", roi: "5.2x" },
        ].map((collab, i) => (
          <div key={i} className="glass-card" style={{ padding: "var(--space-lg)", animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{collab.partner}</div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{collab.type}</div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-xl)" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Reach</div><div style={{ fontWeight: 700 }}>{collab.reach}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Engagement</div><div style={{ fontWeight: 700, color: "var(--brand-success)" }}>{collab.engagement}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>New Followers</div><div style={{ fontWeight: 700 }}>{collab.newFollowers}</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>ROI</div><div style={{ fontWeight: 700, color: "var(--brand-accent)" }}>{collab.roi}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

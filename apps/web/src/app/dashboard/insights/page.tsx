"use client";
import React from "react";
import styles from "../dashboard.module.css";

const heatmapData = [
  [2,1,0,0,0,3,5,7,8,9,8,7,6,5,8,9,7,8,9,6,4,3,2,1],
  [1,0,0,0,1,2,4,6,7,8,7,6,5,6,7,8,9,8,7,5,3,2,1,0],
  [0,0,0,1,1,3,5,7,9,8,7,6,5,7,8,9,8,7,6,4,3,2,1,0],
  [1,0,0,0,1,2,4,6,8,9,8,7,6,6,7,8,7,8,9,5,3,2,1,0],
  [2,1,0,0,0,3,5,8,9,8,7,6,5,5,6,7,8,9,8,6,4,3,2,1],
  [3,2,1,0,1,2,4,5,6,5,4,5,6,7,8,9,8,7,6,5,4,3,2,1],
  [4,3,2,1,1,3,5,6,7,6,5,6,7,8,9,8,7,6,5,4,3,2,2,1],
];
const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function InsightsPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📈 Growth Insights</h1>
        <p className={styles.pageSubtitle}>AI-driven analytics and content strategy recommendations</p>
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: "Avg Engagement", value: "5.2%", change: "+0.8%" },
          { label: "Best Post Time", value: "9:00 AM", change: "Tue & Thu" },
          { label: "Reel Skip Rate", value: "22%", change: "-4.5%" },
          { label: "Save-to-Reach", value: "3.8%", change: "+1.2%" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change positive">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="glass-card" style={{ padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "var(--space-lg)" }}>📊 Best Posting Times</h3>
        <div style={{ display: "grid", gridTemplateColumns: "60px repeat(24, 1fr)", gap: 3, fontSize: "var(--font-size-xs)" }}>
          <div />
          {Array.from({length:24},(_,i) => <div key={i} style={{ textAlign: "center", color: "var(--text-muted)" }}>{i}</div>)}
          {heatmapData.map((row, di) => (
            <React.Fragment key={di}>
              <div style={{ display: "flex", alignItems: "center", color: "var(--text-muted)", fontWeight: 600 }}>{days[di]}</div>
              {row.map((val, hi) => (
                <div key={hi} style={{
                  height: 24, borderRadius: 4,
                  background: val === 0 ? "var(--bg-glass)" : `rgba(108, 92, 231, ${val / 10})`,
                  transition: "background 0.3s ease",
                }} title={`${days[di]} ${hi}:00 — Score: ${val}`} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <h2 className={styles.sectionTitle}>🧠 AI Recommendations</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {[
          { icon: "🎬", title: "Optimize Reel Hooks", desc: "Your 3-second skip rate is 22%. Try starting with a question or surprising visual to hook viewers faster." },
          { icon: "📱", title: "Post More Carousels", desc: "Your carousel posts have a 3.8% save rate vs 1.2% for single images. Carousels drive 2.3x more engagement." },
          { icon: "⏰", title: "Shift YouTube Uploads", desc: "Your best YouTube engagement happens at 2PM EST on Thursdays. Consider moving your upload schedule." },
          { icon: "🔄", title: "Increase Posting Frequency", desc: "Posting 5x/week instead of 3x could increase your reach by ~40% based on your engagement patterns." },
        ].map((rec, i) => (
          <div key={i} className="glass-card" style={{ padding: "var(--space-lg)", display: "flex", gap: "var(--space-md)", animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
            <span style={{ fontSize: "1.5rem" }}>{rec.icon}</span>
            <div>
              <h4 style={{ fontWeight: 700, marginBottom: "var(--space-xs)" }}>{rec.title}</h4>
              <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", lineHeight: 1.6 }}>{rec.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

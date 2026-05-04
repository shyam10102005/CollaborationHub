"use client";
import React from "react";
import styles from "../../dashboard/dashboard.module.css";

const suggestions = [
  { id: "1", name: "Yuki Tanaka", niche: "Streetwear", location: "Tokyo", compatibility: 96, overlap: 8, reason: "Similar aesthetic, minimal audience overlap — perfect for cross-pollination to entirely new followers.", ideas: ["Streetwear haul swap challenge", "Tokyo x NYC style comparison Reel", "Joint lookbook photoshoot"] },
  { id: "2", name: "Jordan Blake", niche: "Photography", location: "London", compatibility: 91, overlap: 12, reason: "Complementary skills. Your lifestyle content + his photography expertise = premium content.", ideas: ["Behind-the-lens creator day vlog", "Photo editing battle short", "Urban exploration collab series"] },
  { id: "3", name: "Priya Sharma", niche: "Travel", location: "Mumbai", compatibility: 87, overlap: 5, reason: "Almost zero audience overlap. Her South Asian audience gives you access to a massive untapped market.", ideas: ["Cultural exchange travel series", "Street food challenge across cities", "Creator life: East meets West documentary"] },
];

export default function SuggestionsPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🧠 AI Collab Suggestions</h1>
        <p className={styles.pageSubtitle}>AI-matched creators optimized for audience growth with minimal overlap</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xl)" }}>
        {suggestions.map((s, i) => (
          <div key={s.id} className="glass-card" style={{ padding: "var(--space-xl)", animation: `fadeIn 0.4s ease-out ${i * 0.1}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-lg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: "1.2rem" }}>{s.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "var(--font-size-lg)" }}>{s.name}</div>
                  <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>{s.niche} • {s.location}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-lg)" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Compatibility</div>
                  <div style={{ fontWeight: 800, fontSize: "var(--font-size-2xl)", color: "var(--brand-success)" }}>{s.compatibility}%</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Overlap</div>
                  <div style={{ fontWeight: 800, fontSize: "var(--font-size-2xl)", color: s.overlap < 10 ? "var(--brand-success)" : "var(--brand-warning)" }}>{s.overlap}%</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-lg)", lineHeight: 1.6, padding: "var(--space-md)", background: "var(--bg-glass)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--brand-primary)" }}>
              💡 {s.reason}
            </p>
            <div style={{ marginBottom: "var(--space-lg)" }}>
              <h4 style={{ fontWeight: 700, fontSize: "var(--font-size-sm)", marginBottom: "var(--space-sm)" }}>✨ AI-Generated Content Ideas</h4>
              <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                {s.ideas.map((idea) => (
                  <span key={idea} className="badge badge-primary" style={{ padding: "6px 14px", fontSize: "var(--font-size-sm)" }}>{idea}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              <button className="btn btn-primary">🤝 Send Collab Request</button>
              <button className="btn btn-secondary">View Full Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

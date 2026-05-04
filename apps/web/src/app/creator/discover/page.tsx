"use client";
import React, { useState } from "react";
import styles from "../../dashboard/dashboard.module.css";

const creators = [
  { id: "1", name: "Alex Rivera", niche: "Fitness", location: "Los Angeles", followers: "342K", engagement: "5.2%", match: 94, bio: "Kettlebell & functional fitness. Daily workouts." },
  { id: "2", name: "Mia Chen", niche: "Tech", location: "San Francisco", followers: "189K", engagement: "6.8%", match: 91, bio: "Reviewing the latest gadgets and creator tools." },
  { id: "3", name: "Yuki Tanaka", niche: "Streetwear", location: "Tokyo", followers: "267K", engagement: "7.1%", match: 88, bio: "Japanese street fashion and sneaker culture." },
  { id: "4", name: "Priya Sharma", niche: "Travel", location: "Mumbai", followers: "425K", engagement: "4.5%", match: 85, bio: "Solo travel adventures across South Asia." },
  { id: "5", name: "Jordan Blake", niche: "Photography", location: "London", followers: "156K", engagement: "8.3%", match: 82, bio: "Urban and landscape photography tutorials." },
  { id: "6", name: "Sofia Martinez", niche: "Food", location: "Mexico City", followers: "298K", engagement: "5.9%", match: 79, bio: "Latin American cuisine and recipe videos." },
];

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(creators);

  const handleSearch = () => {
    if (!query.trim()) { setFiltered(creators); return; }
    const lower = query.toLowerCase();
    setFiltered(creators.filter((c) =>
      c.name.toLowerCase().includes(lower) || c.niche.toLowerCase().includes(lower) || c.location.toLowerCase().includes(lower) || c.bio.toLowerCase().includes(lower)
    ));
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>🔍 Discover Creators</h1>
        <p className={styles.pageSubtitle}>AI-powered semantic search to find your perfect collaborator</p>
      </div>

      {/* Search */}
      <div className="glass-card" style={{ padding: "var(--space-lg)", marginBottom: "var(--space-xl)", display: "flex", gap: "var(--space-sm)" }}>
        <input
          id="discover-search"
          className="input"
          style={{ flex: 1 }}
          placeholder="Try: 'fitness creator in London who focuses on kettlebell workouts'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
      </div>

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-md)" }}>
        {filtered.map((creator, i) => (
          <div key={creator.id} className="glass-card" style={{
            padding: "var(--space-lg)",
            animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, var(--brand-primary), var(--brand-accent))", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>
                {creator.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{creator.name}</div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{creator.niche} • {creator.location}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Match</div>
                <div style={{ fontWeight: 700, color: creator.match >= 90 ? "var(--brand-success)" : "var(--brand-primary-light)" }}>{creator.match}%</div>
              </div>
            </div>
            <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-md)", lineHeight: 1.5 }}>{creator.bio}</p>
            <div style={{ display: "flex", gap: "var(--space-md)", marginBottom: "var(--space-md)" }}>
              <div><span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Followers</span><div style={{ fontWeight: 700, fontSize: "var(--font-size-sm)" }}>{creator.followers}</div></div>
              <div><span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Engagement</span><div style={{ fontWeight: 700, fontSize: "var(--font-size-sm)", color: "var(--brand-success)" }}>{creator.engagement}</div></div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-sm)" }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>🤝 Connect</button>
              <button className="btn btn-secondary btn-sm">View Profile</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

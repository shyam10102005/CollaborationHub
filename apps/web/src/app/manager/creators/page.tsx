"use client";

import React, { useEffect, useState } from "react";
import { api, ManagerUser } from "@/lib/api";
import styles from "../../dashboard/dashboard.module.css";

export default function ManagerCreatorsPage() {
  const [creators, setCreators] = useState<ManagerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCreators() {
      try {
        const data = await api.getManagerCreators();
        setCreators(data);
      } catch (err) {
        console.error("Failed to fetch creators:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCreators();
  }, []);

  const filtered = creators.filter((c) => {
    const query = search.toLowerCase();
    return (
      (c.display_name?.toLowerCase().includes(query) ?? false) ||
      c.email.toLowerCase().includes(query) ||
      (c.profile?.niche as string || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Creator Directory 🎨</h1>
        <p className={styles.pageSubtitle}>
          {loading ? "Loading creators..." : `${creators.length} creators registered on the platform`}
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <input
          type="text"
          className="input"
          placeholder="Search creators by name, email, or niche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="manager-creators-search"
          style={{ maxWidth: 480 }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-2xl)", color: "var(--text-muted)" }}>
          Loading creator data...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "var(--space-2xl)",
          color: "var(--text-muted)",
          background: "var(--bg-glass)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-subtle)",
        }}>
          {search ? "No creators match your search." : "No creators registered yet."}
        </div>
      ) : (
        <div style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(20px)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
        }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
          }}>
            <thead>
              <tr style={{
                borderBottom: "1px solid var(--border-subtle)",
                background: "rgba(108, 92, 231, 0.06)",
              }}>
                <th style={thStyle}>Creator</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Niche</th>
                <th style={thStyle}>Followers</th>
                <th style={thStyle}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((creator) => (
                <tr
                  key={creator.id}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(108, 92, 231, 0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(108, 92, 231, 0.3), rgba(162, 155, 254, 0.3))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        flexShrink: 0,
                      }}>
                        {creator.display_name?.[0]?.toUpperCase() || creator.email[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {creator.display_name || creator.email.split("@")[0]}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{creator.email}</td>
                  <td style={tdStyle}>
                    {creator.profile?.niche ? (
                      <span style={{
                        padding: "2px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 600,
                        background: "rgba(108, 92, 231, 0.12)",
                        color: "var(--brand-primary-light)",
                      }}>
                        {creator.profile.niche as string}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-xs)" }}>—</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums" }}>
                    {creator.profile?.follower_count
                      ? Number(creator.profile.follower_count).toLocaleString()
                      : "—"}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: "var(--font-size-xs)" }}>
                    {new Date(creator.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: "14px 20px",
  textAlign: "left",
  fontSize: "var(--font-size-xs)",
  fontWeight: 600,
  color: "var(--text-muted)",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 20px",
  fontSize: "var(--font-size-sm)",
  color: "var(--text-secondary)",
};

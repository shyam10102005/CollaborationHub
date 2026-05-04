"use client";

import React, { useEffect, useState } from "react";
import { api, ManagerUser } from "@/lib/api";
import styles from "../../dashboard/dashboard.module.css";

export default function ManagerBrandsPage() {
  const [brands, setBrands] = useState<ManagerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchBrands() {
      try {
        const data = await api.getManagerBrands();
        setBrands(data);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBrands();
  }, []);

  const filtered = brands.filter((b) => {
    const query = search.toLowerCase();
    return (
      (b.display_name?.toLowerCase().includes(query) ?? false) ||
      b.email.toLowerCase().includes(query) ||
      (b.profile?.company_name as string || "").toLowerCase().includes(query) ||
      (b.profile?.industry as string || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Brand Directory 🏢</h1>
        <p className={styles.pageSubtitle}>
          {loading ? "Loading brands..." : `${brands.length} brands registered on the platform`}
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <input
          type="text"
          className="input"
          placeholder="Search brands by name, email, industry, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="manager-brands-search"
          style={{ maxWidth: 480 }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "var(--space-2xl)", color: "var(--text-muted)" }}>
          Loading brand data...
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
          {search ? "No brands match your search." : "No brands registered yet."}
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
                background: "rgba(0, 206, 201, 0.06)",
              }}>
                <th style={thStyle}>Company</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Industry</th>
                <th style={thStyle}>Budget Range</th>
                <th style={thStyle}>Website</th>
                <th style={thStyle}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((brand) => (
                <tr
                  key={brand.id}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 206, 201, 0.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, rgba(0, 206, 201, 0.3), rgba(129, 236, 236, 0.3))",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "var(--font-size-sm)",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        flexShrink: 0,
                      }}>
                        {(brand.profile?.company_name as string)?.[0]?.toUpperCase() ||
                          brand.display_name?.[0]?.toUpperCase() ||
                          brand.email[0].toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {(brand.profile?.company_name as string) || brand.display_name || brand.email.split("@")[0]}
                      </span>
                    </div>
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)" }}>{brand.email}</td>
                  <td style={tdStyle}>
                    {brand.profile?.industry ? (
                      <span style={{
                        padding: "2px 10px",
                        borderRadius: "var(--radius-full)",
                        fontSize: "var(--font-size-xs)",
                        fontWeight: 600,
                        background: "rgba(0, 206, 201, 0.12)",
                        color: "var(--brand-accent)",
                      }}>
                        {brand.profile.industry as string}
                      </span>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-xs)" }}>—</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-secondary)" }}>
                    {(brand.profile?.budget_range as string) || "—"}
                  </td>
                  <td style={tdStyle}>
                    {brand.profile?.website ? (
                      <a
                        href={brand.profile.website as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--brand-primary-light)",
                          fontSize: "var(--font-size-xs)",
                          textDecoration: "none",
                        }}
                      >
                        {(brand.profile.website as string).replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-xs)" }}>—</span>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: "var(--text-muted)", fontSize: "var(--font-size-xs)" }}>
                    {new Date(brand.created_at).toLocaleDateString("en-US", {
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

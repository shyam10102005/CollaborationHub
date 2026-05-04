"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { api, ManagerUser } from "@/lib/api";
import styles from "../../dashboard/dashboard.module.css";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [creators, setCreators] = useState<ManagerUser[]>([]);
  const [brands, setBrands] = useState<ManagerUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [creatorsData, brandsData] = await Promise.all([
          api.getManagerCreators(),
          api.getManagerBrands(),
        ]);
        setCreators(creatorsData);
        setBrands(brandsData);
      } catch (err) {
        console.error("Failed to fetch manager data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalUsers = creators.length + brands.length;
  const recentCreators = creators.filter((c) => {
    const created = new Date(c.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return created >= sevenDaysAgo;
  });
  const recentBrands = brands.filter((b) => {
    const created = new Date(b.created_at);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return created >= sevenDaysAgo;
  });

  const stats = [
    { label: "Total Users", value: loading ? "—" : totalUsers.toString(), icon: "👥" },
    { label: "Total Creators", value: loading ? "—" : creators.length.toString(), icon: "🎨" },
    { label: "Total Brands", value: loading ? "—" : brands.length.toString(), icon: "🏢" },
    { label: "New This Week", value: loading ? "—" : (recentCreators.length + recentBrands.length).toString(), icon: "📈" },
  ];

  const quickLinks = [
    { icon: "🎨", title: "Creator Directory", desc: "View and manage all registered creators on the platform", href: "/manager/creators" },
    { icon: "🏢", title: "Brand Directory", desc: "View and manage all registered brands on the platform", href: "/manager/brands" },
  ];

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Manager Dashboard 🛡️
        </h1>
        <p className={styles.pageSubtitle}>
          Welcome back, {user?.display_name || "Manager"}. Here&apos;s your platform overview.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.icon} {stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Link href="/manager/creators" className="btn btn-primary">
          🎨 View Creators
        </Link>
        <Link href="/manager/brands" className="btn btn-secondary">
          🏢 View Brands
        </Link>
      </div>

      {/* Module Grid */}
      <h2 className={styles.sectionTitle}>Platform Management</h2>
      <div className={styles.moduleGrid}>
        {quickLinks.map((mod) => (
          <Link key={mod.href} href={mod.href} className={styles.moduleCard}>
            <span className={styles.moduleIcon}>{mod.icon}</span>
            <h3 className={styles.moduleTitle}>{mod.title}</h3>
            <p className={styles.moduleDesc}>{mod.desc}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      {!loading && (
        <>
          <h2 className={styles.sectionTitle} style={{ marginTop: "var(--space-xl)" }}>
            Recent Registrations
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "var(--space-md)",
          }}>
            {[...creators, ...brands]
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 6)
              .map((u) => (
                <div
                  key={u.id}
                  style={{
                    padding: "var(--space-lg)",
                    background: "var(--bg-glass)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-sm)" }}>
                    <div style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: u.user_type === "creator"
                        ? "linear-gradient(135deg, rgba(108, 92, 231, 0.3), rgba(162, 155, 254, 0.3))"
                        : "linear-gradient(135deg, rgba(0, 206, 201, 0.3), rgba(129, 236, 236, 0.3))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "var(--font-size-sm)",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}>
                      {u.display_name?.[0]?.toUpperCase() || u.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "var(--font-size-sm)" }}>
                        {u.display_name || u.email.split("@")[0]}
                      </div>
                      <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                        {u.email}
                      </div>
                    </div>
                    <span style={{
                      marginLeft: "auto",
                      padding: "2px 10px",
                      borderRadius: "var(--radius-full)",
                      fontSize: "var(--font-size-xs)",
                      fontWeight: 600,
                      background: u.user_type === "creator"
                        ? "rgba(108, 92, 231, 0.12)"
                        : "rgba(0, 206, 201, 0.12)",
                      color: u.user_type === "creator"
                        ? "var(--brand-primary-light)"
                        : "var(--brand-accent)",
                    }}>
                      {u.user_type}
                    </span>
                  </div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                    Joined {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

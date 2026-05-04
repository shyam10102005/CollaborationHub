"use client";

import React from "react";
import styles from "../../dashboard/dashboard.module.css";

const monthlyData = [
  { month: "Jan", sponsorship: 3200, affiliate: 800, splits: 400 },
  { month: "Feb", sponsorship: 4100, affiliate: 950, splits: 600 },
  { month: "Mar", sponsorship: 3800, affiliate: 1200, splits: 800 },
  { month: "Apr", sponsorship: 5500, affiliate: 1100, splits: 1200 },
  { month: "May", sponsorship: 6200, affiliate: 1400, splits: 820 },
];

const maxEarning = 8500;

const transactions = [
  { id: "1", brand: "Nike", type: "Sponsorship", amount: "$4,500", date: "May 2, 2026", status: "completed" },
  { id: "2", brand: "Adobe", type: "Sponsorship", amount: "$3,200", date: "Apr 28, 2026", status: "pending" },
  { id: "3", brand: "Amazon", type: "Affiliate", amount: "$890", date: "Apr 25, 2026", status: "completed" },
  { id: "4", brand: "Collab Split", type: "Split Earnings", amount: "$1,200", date: "Apr 22, 2026", status: "completed" },
  { id: "5", brand: "Canva", type: "Sponsorship", amount: "$2,000", date: "Apr 18, 2026", status: "completed" },
];

export default function EarningsPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>💰 Earnings Dashboard</h1>
        <p className={styles.pageSubtitle}>Track revenue across all income streams</p>
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: "Total Earnings", value: "$42,870", change: "+28.4%" },
          { label: "This Month", value: "$8,420", change: "+12.1%" },
          { label: "Pending Payouts", value: "$3,200", change: "2 pending" },
          { label: "Avg Deal Size", value: "$4,250", change: "+$580" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change positive">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart (CSS-only bar chart) */}
      <div className="glass-card" style={{ padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
        <h3 style={{ fontWeight: 700, marginBottom: "var(--space-lg)" }}>Monthly Revenue</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-lg)", height: 200 }}>
          {monthlyData.map((d) => {
            const total = d.sponsorship + d.affiliate + d.splits;
            return (
              <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-xs)" }}>
                <span style={{ fontSize: "var(--font-size-xs)", fontWeight: 600, color: "var(--text-secondary)" }}>
                  ${(total / 1000).toFixed(1)}k
                </span>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 2, maxWidth: 60 }}>
                  <div style={{ height: `${(d.sponsorship / maxEarning) * 160}px`, background: "linear-gradient(180deg, var(--brand-primary), var(--brand-primary-dark))", borderRadius: "var(--radius-sm) var(--radius-sm) 0 0", transition: "height 0.5s ease" }} />
                  <div style={{ height: `${(d.affiliate / maxEarning) * 160}px`, background: "var(--brand-accent)", transition: "height 0.5s ease" }} />
                  <div style={{ height: `${(d.splits / maxEarning) * 160}px`, background: "var(--brand-warning)", borderRadius: "0 0 var(--radius-sm) var(--radius-sm)", transition: "height 0.5s ease" }} />
                </div>
                <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{d.month}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: "var(--space-lg)", marginTop: "var(--space-lg)", justifyContent: "center" }}>
          {[
            { label: "Sponsorships", color: "var(--brand-primary)" },
            { label: "Affiliates", color: "var(--brand-accent)" },
            { label: "Splits", color: "var(--brand-warning)" },
          ].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)" }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <h2 className={styles.sectionTitle}>Recent Transactions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
        {transactions.map((tx, i) => (
          <div key={tx.id} className="glass-card" style={{
            padding: "var(--space-md)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-md)",
            animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--bg-glass-hover)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>
              {tx.type === "Sponsorship" ? "🤝" : tx.type === "Affiliate" ? "🔗" : "💸"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>{tx.brand}</div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{tx.type} • {tx.date}</div>
            </div>
            <span style={{ fontWeight: 700, color: "var(--brand-success)" }}>{tx.amount}</span>
            <span className={`badge ${tx.status === "completed" ? "badge-success" : "badge-warning"}`}>{tx.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

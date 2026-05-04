"use client";
import React from "react";
import styles from "../dashboard.module.css";

export default function PaymentsPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>💳 Payments</h1>
        <p className={styles.pageSubtitle}>Stripe Connect, split earnings, and escrow management</p>
      </div>

      {/* Stripe Connect Status */}
      <div className="glass-card" style={{ padding: "var(--space-xl)", marginBottom: "var(--space-xl)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontWeight: 700, marginBottom: "var(--space-xs)" }}>Stripe Connect</h3>
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>Connect your bank account to receive payouts</p>
        </div>
        <span className="badge badge-success" style={{ padding: "8px 16px", fontSize: "var(--font-size-sm)" }}>✓ Connected</span>
      </div>

      <div className={styles.statsGrid}>
        {[
          { label: "Available Balance", value: "$6,420", change: "Ready to withdraw" },
          { label: "In Escrow", value: "$8,200", change: "3 active deals" },
          { label: "Total Paid Out", value: "$34,650", change: "All time" },
          { label: "Split Earnings", value: "$4,800", change: "From 5 collabs" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change positive">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Active Splits */}
      <h2 className={styles.sectionTitle}>Active Payment Splits</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {[
          { campaign: "Nike Summer Campaign", total: "$12,000", yourShare: "$7,200 (60%)", partner: "Alex Rivera: $4,800 (40%)", status: "In Escrow" },
          { campaign: "Adobe Creator Spotlight", total: "$8,500", yourShare: "$4,250 (50%)", partner: "Mia Chen: $4,250 (50%)", status: "Pending Approval" },
        ].map((split, i) => (
          <div key={i} className="glass-card" style={{ padding: "var(--space-lg)", animation: `fadeIn 0.3s ease-out ${i * 0.05}s both` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
              <div>
                <div style={{ fontWeight: 700 }}>{split.campaign}</div>
                <div style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>Total: {split.total}</div>
              </div>
              <span className="badge badge-warning">{split.status}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
              <div style={{ padding: "var(--space-md)", background: "var(--bg-glass)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--brand-success)" }}>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Your Share</div>
                <div style={{ fontWeight: 700, color: "var(--brand-success)" }}>{split.yourShare}</div>
              </div>
              <div style={{ padding: "var(--space-md)", background: "var(--bg-glass)", borderRadius: "var(--radius-md)", borderLeft: "3px solid var(--brand-primary)" }}>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Partner</div>
                <div style={{ fontWeight: 700, color: "var(--brand-primary-light)" }}>{split.partner}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

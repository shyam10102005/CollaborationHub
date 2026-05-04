"use client";
import React from "react";
import styles from "../../dashboard/dashboard.module.css";

const budgetData = [
  { category: "Fitness Creators", allocated: 15000, spent: 8400, campaigns: 2 },
  { category: "Tech Reviews", allocated: 8000, spent: 2200, campaigns: 1 },
  { category: "Fashion Collabs", allocated: 22000, spent: 22000, campaigns: 1 },
  { category: "Food Content", allocated: 5000, spent: 0, campaigns: 0 },
];

const totalAllocated = budgetData.reduce((a, b) => a + b.allocated, 0);
const totalSpent = budgetData.reduce((a, b) => a + b.spent, 0);

export default function BrandBudgetPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>💰 Budget Tracking</h1>
        <p className={styles.pageSubtitle}>Monitor spending and ROI across your campaigns</p>
      </div>

      {/* Summary Stats */}
      <div className={styles.statsGrid}>
        <div className="stat-card">
          <div className="stat-label">Total Allocated</div>
          <div className="stat-value">${(totalAllocated / 1000).toFixed(1)}K</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Spent</div>
          <div className="stat-value">${(totalSpent / 1000).toFixed(1)}K</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Remaining</div>
          <div className="stat-value">${((totalAllocated - totalSpent) / 1000).toFixed(1)}K</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Utilization</div>
          <div className="stat-value">{Math.round((totalSpent / totalAllocated) * 100)}%</div>
        </div>
      </div>

      {/* Budget Breakdown */}
      <h2 className={styles.sectionTitle}>Budget Breakdown</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {budgetData.map((item, i) => {
          const pct = item.allocated > 0 ? Math.round((item.spent / item.allocated) * 100) : 0;
          return (
            <div key={item.category} className="glass-card" style={{
              padding: "var(--space-lg)",
              animation: `fadeIn 0.3s ease-out ${i * 0.1}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-md)" }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.category}</div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{item.campaigns} campaign{item.campaigns !== 1 ? "s" : ""}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700 }}>${item.spent.toLocaleString()} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/ ${item.allocated.toLocaleString()}</span></div>
                  <div style={{ fontSize: "var(--font-size-xs)", color: pct >= 100 ? "var(--brand-danger)" : pct >= 75 ? "var(--brand-warning)" : "var(--brand-success)" }}>{pct}% used</div>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height: 6, borderRadius: 3, background: "var(--bg-glass)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(pct, 100)}%`,
                  borderRadius: 3,
                  background: pct >= 100 ? "var(--brand-danger)" : pct >= 75 ? "var(--brand-warning)" : "linear-gradient(90deg, var(--brand-primary), var(--brand-accent))",
                  transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

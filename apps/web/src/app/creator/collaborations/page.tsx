"use client";

import React, { useState } from "react";
import styles from "../../dashboard/dashboard.module.css";

const campaigns = [
  { id: "1", brand: "Nike", title: "Summer Running Campaign", budget: "$12,000", status: "active", deliverables: 3, completed: 1, dueDate: "May 15, 2026" },
  { id: "2", brand: "Adobe", title: "Creator Tools Spotlight", budget: "$8,500", status: "in_review", deliverables: 2, completed: 0, dueDate: "May 22, 2026" },
  { id: "3", brand: "Spotify", title: "Playlist Curator Series", budget: "$5,000", status: "draft", deliverables: 4, completed: 0, dueDate: "Jun 1, 2026" },
  { id: "4", brand: "Samsung", title: "Galaxy S26 Unboxing", budget: "$15,000", status: "completed", deliverables: 2, completed: 2, dueDate: "Apr 30, 2026" },
  { id: "5", brand: "Canva", title: "Design Tips Series", budget: "$6,000", status: "active", deliverables: 5, completed: 3, dueDate: "May 20, 2026" },
];

const statusConfig: Record<string, { label: string; badge: string }> = {
  draft: { label: "Draft", badge: "badge-warning" },
  active: { label: "Active", badge: "badge-success" },
  in_review: { label: "In Review", badge: "badge-primary" },
  completed: { label: "Completed", badge: "badge-success" },
};

export default function CollaborationsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 className={styles.pageTitle}>🤝 Collaborations</h1>
            <p className={styles.pageSubtitle}>Manage brand deals, deliverables, and campaign workflows</p>
          </div>
          <button className="btn btn-primary">+ New Campaign</button>
        </div>
      </div>

      <div className={styles.statsGrid} style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Active Deals", value: "3", change: "+2 this month" },
          { label: "Total Revenue", value: "$46,500", change: "+34%" },
          { label: "Pending Review", value: "2", change: "Action needed" },
          { label: "Completion Rate", value: "94%", change: "+5%" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-change positive">{s.change}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-lg)" }}>
        {["all", "draft", "active", "in_review", "completed"].map((f) => (
          <button key={f} className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`} onClick={() => setFilter(f)}>
            {f === "all" ? "All" : statusConfig[f]?.label || f}
          </button>
        ))}
      </div>

      {/* Campaign Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {filtered.map((campaign, i) => (
          <div key={campaign.id} className="glass-card" style={{
            padding: "var(--space-lg)",
            animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-md)" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}>
                  <h3 style={{ fontWeight: 700 }}>{campaign.title}</h3>
                  <span className={`badge ${statusConfig[campaign.status]?.badge}`}>
                    {statusConfig[campaign.status]?.label}
                  </span>
                </div>
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>
                  {campaign.brand} • Due: {campaign.dueDate}
                </p>
              </div>
              <span style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--brand-success)" }}>
                {campaign.budget}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-xs)" }}>
                  <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Deliverables</span>
                  <span style={{ fontSize: "var(--font-size-xs)", fontWeight: 600 }}>{campaign.completed}/{campaign.deliverables}</span>
                </div>
                <div style={{ height: 6, background: "var(--bg-glass)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(campaign.completed / campaign.deliverables) * 100}%`, background: "var(--brand-success)", borderRadius: "var(--radius-full)", transition: "width 0.5s ease" }} />
                </div>
              </div>
              <button className="btn btn-secondary btn-sm">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

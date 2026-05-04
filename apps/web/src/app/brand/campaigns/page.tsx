"use client";
import React from "react";
import styles from "../../dashboard/dashboard.module.css";

const campaigns = [
  { id: "1", title: "Summer Fitness Launch", status: "active", budget: "$15,000", creators: 4, startDate: "May 1, 2026", endDate: "Jun 30, 2026" },
  { id: "2", title: "Tech Review Series", status: "draft", budget: "$8,000", creators: 2, startDate: "Jun 15, 2026", endDate: "Jul 31, 2026" },
  { id: "3", title: "Holiday Fashion Collab", status: "completed", budget: "$22,000", creators: 6, startDate: "Nov 1, 2025", endDate: "Dec 31, 2025" },
];

const statusColors: Record<string, string> = {
  active: "var(--brand-success)",
  draft: "var(--brand-warning)",
  completed: "var(--brand-primary-light)",
};

export default function BrandCampaignsPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📋 My Campaigns</h1>
        <p className={styles.pageSubtitle}>Create and manage your influencer marketing campaigns</p>
      </div>

      <div style={{ marginBottom: "var(--space-xl)" }}>
        <button className="btn btn-primary">+ Create Campaign</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {campaigns.map((campaign, i) => (
          <div key={campaign.id} className="glass-card" style={{
            padding: "var(--space-lg)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-xl)",
            animation: `fadeIn 0.3s ease-out ${i * 0.1}s both`,
            flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--font-size-lg)", marginBottom: "var(--space-xs)" }}>{campaign.title}</div>
              <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{campaign.startDate} → {campaign.endDate}</div>
            </div>
            <div style={{ display: "flex", gap: "var(--space-xl)", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Status</div>
                <span className="badge" style={{ background: `${statusColors[campaign.status]}22`, color: statusColors[campaign.status], padding: "4px 12px" }}>
                  {campaign.status}
                </span>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Budget</div>
                <div style={{ fontWeight: 700 }}>{campaign.budget}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>Creators</div>
                <div style={{ fontWeight: 700 }}>{campaign.creators}</div>
              </div>
              <button className="btn btn-secondary btn-sm">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

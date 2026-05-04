"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import styles from "../../dashboard/dashboard.module.css";

const stats = [
  { label: "Active Campaigns", value: "4", change: "+2", positive: true },
  { label: "Total Spend", value: "$24.5K", change: "+18.2%", positive: true },
  { label: "Creators Hired", value: "12", change: "+5", positive: true },
  { label: "Avg. ROI", value: "3.8x", change: "+0.4x", positive: true },
];

const modules = [
  { icon: "🔍", title: "Search Creators", desc: "Find the perfect creators for your campaigns with AI-powered matching", href: "/brand/search" },
  { icon: "📋", title: "My Campaigns", desc: "Create, manage, and track your influencer marketing campaigns", href: "/brand/campaigns" },
  { icon: "💰", title: "Budget Tracking", desc: "Monitor spending, ROI, and budget allocation across campaigns", href: "/brand/budget" },
];

export default function BrandDashboard() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Welcome, {user?.display_name || "Brand"} 🏢
        </h1>
        <p className={styles.pageSubtitle}>
          Your brand dashboard overview
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-change ${stat.positive ? "positive" : "negative"}`}>
              {stat.change} this month
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <Link href="/brand/search" className="btn btn-primary">
          🔍 Find Creators
        </Link>
        <Link href="/brand/campaigns" className="btn btn-secondary">
          📋 New Campaign
        </Link>
        <Link href="/brand/budget" className="btn btn-secondary">
          💰 View Budget
        </Link>
      </div>

      {/* Module Grid */}
      <h2 className={styles.sectionTitle}>Your Modules</h2>
      <div className={styles.moduleGrid}>
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} className={styles.moduleCard}>
            <span className={styles.moduleIcon}>{mod.icon}</span>
            <h3 className={styles.moduleTitle}>{mod.title}</h3>
            <p className={styles.moduleDesc}>{mod.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

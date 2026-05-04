"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import styles from "../../dashboard/dashboard.module.css";

const stats = [
  { label: "Total Followers", value: "248.5K", change: "+12.3%", positive: true },
  { label: "Engagement Rate", value: "4.8%", change: "+0.6%", positive: true },
  { label: "Monthly Earnings", value: "$8,420", change: "+23.1%", positive: true },
  { label: "Active Collabs", value: "7", change: "+3", positive: true },
];

const modules = [
  { icon: "🔗", title: "Link-in-Bio", desc: "Manage your digital portfolio and track link performance", href: "/creator/link-in-bio" },
  { icon: "📅", title: "Content Planner", desc: "Schedule and publish across Instagram, YouTube, and X", href: "/creator/content-planner" },
  { icon: "✨", title: "AI Assistant", desc: "Generate captions, hashtags, and content ideas with AI", href: "/creator/ai-assistant" },
  { icon: "🤝", title: "Collaborations", desc: "Manage brand deals, deliverables, and campaign workflows", href: "/creator/collaborations" },
  { icon: "💰", title: "Earnings", desc: "Track revenue across sponsorships, affiliates, and splits", href: "/creator/earnings" },
  { icon: "📊", title: "Media Kit", desc: "Auto-generate verified media kits with real-time data", href: "/creator/media-kit" },
  { icon: "🔍", title: "Discover Creators", desc: "Find collaboration partners with AI-powered search", href: "/creator/discover" },
  { icon: "💬", title: "Chat", desc: "Real-time messaging with collaborators and brands", href: "/creator/chat" },
  { icon: "📈", title: "Growth Insights", desc: "AI-driven analytics and content strategy recommendations", href: "/creator/insights" },
  { icon: "🧠", title: "AI Suggestions", desc: "Get AI-matched collaboration recommendations", href: "/creator/suggestions" },
  { icon: "📋", title: "Collab Planner", desc: "Shared calendars and cross-posting schedules", href: "/creator/collab-planner" },
  { icon: "💳", title: "Payments", desc: "Stripe Connect, split earnings, and escrow management", href: "/creator/payments" },
];

export default function CreatorDashboard() {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Welcome back, {user?.display_name || "Creator"} 👋
        </h1>
        <p className={styles.pageSubtitle}>
          Here&apos;s your CollabarationOS overview for today
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
        <Link href="/creator/content-planner" className="btn btn-primary">
          📅 Schedule Post
        </Link>
        <Link href="/creator/ai-assistant" className="btn btn-secondary">
          ✨ Generate Caption
        </Link>
        <Link href="/creator/discover" className="btn btn-secondary">
          🔍 Find Collaborators
        </Link>
        <Link href="/creator/media-kit" className="btn btn-secondary">
          📊 Update Media Kit
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

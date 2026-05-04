"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const creatorSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/creator/dashboard", icon: "⬡" },
    ],
  },
  {
    title: "Content",
    items: [
      { label: "Link-in-Bio", href: "/creator/link-in-bio", icon: "🔗" },
      { label: "Content Planner", href: "/creator/content-planner", icon: "📅" },
      { label: "AI Assistant", href: "/creator/ai-assistant", icon: "✨" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Collaborations", href: "/creator/collaborations", icon: "🤝" },
      { label: "Earnings", href: "/creator/earnings", icon: "💰" },
      { label: "Media Kit", href: "/creator/media-kit", icon: "📊" },
    ],
  },
  {
    title: "Network",
    items: [
      { label: "Discover", href: "/creator/discover", icon: "🔍" },
      { label: "Requests", href: "/creator/requests", icon: "📨" },
      { label: "Chat", href: "/creator/chat", icon: "💬" },
      { label: "Collab Planner", href: "/creator/collab-planner", icon: "📋" },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Growth Insights", href: "/creator/insights", icon: "📈" },
      { label: "Collab Performance", href: "/creator/collab-performance", icon: "🎯" },
      { label: "AI Suggestions", href: "/creator/suggestions", icon: "🧠" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Payments", href: "/creator/payments", icon: "💳" },
    ],
  },
];

const brandSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/brand/dashboard", icon: "⬡" },
    ],
  },
  {
    title: "Creators",
    items: [
      { label: "Search Creators", href: "/brand/search", icon: "🔍" },
    ],
  },
  {
    title: "Campaigns",
    items: [
      { label: "My Campaigns", href: "/brand/campaigns", icon: "📋" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Budget", href: "/brand/budget", icon: "💰" },
    ],
  },
];

export default function Sidebar({ role = "creator" }: { role?: "creator" | "brand" }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const navSections = role === "brand" ? brandSections : creatorSections;

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.logo}>
        {!collapsed && (
          <>
            <span className={styles.logoIcon}>◈</span>
            <span className={styles.logoText}>CollabarationOS</span>
          </>
        )}
        <button
          className={styles.collapseBtn}
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          {collapsed ? "▸" : "◂"}
        </button>
      </div>

      <nav className={styles.nav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.section}>
            {!collapsed && <span className={styles.sectionTitle}>{section.title}</span>}
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className={styles.navBadge}>{item.badge}</span>
                  )}
                  {isActive && <span className={styles.activeIndicator} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}

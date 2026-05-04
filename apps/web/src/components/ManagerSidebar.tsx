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

const managerSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/manager/dashboard", icon: "⬡" },
    ],
  },
  {
    title: "Directory",
    items: [
      { label: "All Creators", href: "/manager/creators", icon: "🎨" },
      { label: "All Brands", href: "/manager/brands", icon: "🏢" },
    ],
  },
];

export default function ManagerSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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

      {!collapsed && (
        <div style={{
          padding: "var(--space-sm) var(--space-md)",
          margin: "0 var(--space-sm)",
          marginBottom: "var(--space-sm)",
          background: "rgba(108, 92, 231, 0.08)",
          borderRadius: "var(--radius-md)",
          border: "1px solid rgba(108, 92, 231, 0.15)",
        }}>
          <span style={{
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: "var(--brand-primary-light)",
            textTransform: "uppercase" as const,
            letterSpacing: "0.05em",
          }}>
            🛡️ Manager Panel
          </span>
        </div>
      )}

      <nav className={styles.nav}>
        {managerSections.map((section) => (
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

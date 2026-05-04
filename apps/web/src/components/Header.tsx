"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search creators, campaigns, content..."
          id="global-search"
        />
        <kbd className={styles.searchKbd}>⌘K</kbd>
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Notifications" id="notifications-btn">
          <span>🔔</span>
          <span className={styles.notifDot} />
        </button>

        <div className={styles.userMenu}>
          <div className={styles.avatar}>
            {user?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.display_name || "Creator"}</span>
            <span className={styles.userType}>{user?.user_type || "creator"}</span>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Logout" id="logout-btn">
            ⏻
          </button>
        </div>
      </div>
    </header>
  );
}

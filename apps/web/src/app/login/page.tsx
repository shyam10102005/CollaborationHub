"use client";

import React from "react";
import Link from "next/link";
import styles from "./auth.module.css";

export default function LoginPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authBackground}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>

      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <span className={styles.logo}>◈</span>
          <h1 className={styles.title}>Choose your role</h1>
          <p className={styles.subtitle}>How would you like to sign in?</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <Link
            href="/login/creator"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
            id="login-as-creator"
          >
            🎨 Sign in as Creator
          </Link>
          <Link
            href="/login/brand"
            className="btn btn-secondary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
            id="login-as-brand"
          >
            🏢 Sign in as Brand
          </Link>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          margin: "var(--space-md) 0",
        }}>
          <span style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }} />
        </div>

        <Link
          href="/login/manager"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "10px 20px",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            color: "var(--text-muted)",
            fontSize: "var(--font-size-sm)",
            fontWeight: 500,
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
          id="login-as-manager"
        >
          🛡️ Manager Portal
        </Link>

        <p className={styles.authFooter}>
          Don&apos;t have an account?{" "}
          <Link href="/signup/creator">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

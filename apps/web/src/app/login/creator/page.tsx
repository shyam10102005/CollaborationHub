"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import styles from "../../login/auth.module.css";

export default function CreatorLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/creator/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
          <div className={styles.roleBadge}>🎨 Creator</div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your creator dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.error}>{error}</div>}

          <div className="input-group">
            <label htmlFor="creator-login-email">Email</label>
            <input id="creator-login-email" type="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label htmlFor="creator-login-password">Password</label>
            <input id="creator-login-password" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%" }} id="creator-login-submit">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={styles.authFooter}>
          New Creator? <Link href="/signup/creator">Sign Up</Link>
        </p>
        <p className={styles.authFooter} style={{ marginTop: "var(--space-xs)" }}>
          <Link href="/login/brand">I&apos;m a Brand →</Link>
        </p>
      </div>
    </div>
  );
}

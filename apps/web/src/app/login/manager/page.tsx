"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import styles from "../../login/auth.module.css";

export default function ManagerLoginPage() {
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
      const userData = await login(email, password);
      if (userData.user_type !== "manager") {
        setError("This account is not authorized as a manager.");
        return;
      }
      router.push("/manager/dashboard");
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
          <div className={styles.roleBadge}>🛡️ Manager</div>
          <h1 className={styles.title}>Manager Portal</h1>
          <p className={styles.subtitle}>Sign in with your manager credentials</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.error}>{error}</div>}

          <div className="input-group">
            <label htmlFor="manager-login-email">Email</label>
            <input
              id="manager-login-email"
              type="email"
              className="input"
              placeholder="manager@collabarationos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="manager-login-password">Password</label>
            <input
              id="manager-login-password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: "100%" }}
            id="manager-login-submit"
          >
            {loading ? "Signing in..." : "Sign In as Manager"}
          </button>
        </form>

        <p className={styles.authFooter}>
          <Link href="/login">← Back to role selection</Link>
        </p>
      </div>
    </div>
  );
}

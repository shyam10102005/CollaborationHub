"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import styles from "../../login/auth.module.css";

const NICHES = ["Food", "Tech", "Fashion", "Fitness", "Travel", "Beauty", "Gaming", "Music", "Education", "Photography", "Lifestyle", "Comedy", "Finance", "Health", "Art", "Other"];

export default function CreatorSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [niche, setNiche] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [followers, setFollowers] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerCreator, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const socialLinks: Record<string, string> = {};
      if (instagram) socialLinks.instagram = instagram;
      if (youtube) socialLinks.youtube = youtube;
      await registerCreator(email, password, name || undefined, niche || undefined, socialLinks, parseInt(followers) || 0);
      router.push("/creator/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
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
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Start your creator journey</p>
        </div>

        {/* Google Sign-Up */}
        <button type="button" className={styles.googleBtn} onClick={() => loginWithGoogle("creator")} id="signup-google-creator">
          <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Sign up with Google
        </button>

        <div className={styles.divider}>
          <span className={styles.dividerLine} />
          <span className={styles.dividerText}>or</span>
          <span className={styles.dividerLine} />
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formRow}>
            <div className="input-group">
              <label htmlFor="creator-name">Display Name</label>
              <input id="creator-name" type="text" className="input" placeholder="Your creator name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="creator-niche">Niche</label>
              <select id="creator-niche" className="input" value={niche} onChange={(e) => setNiche(e.target.value)}>
                <option value="">Select niche</option>
                {NICHES.map((n) => <option key={n} value={n.toLowerCase()}>{n}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="creator-email">Email</label>
            <input id="creator-email" type="email" className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label htmlFor="creator-password">Password</label>
            <input id="creator-password" type="password" className="input" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>

          <div className={styles.formRow}>
            <div className="input-group">
              <label htmlFor="creator-instagram">Instagram</label>
              <input id="creator-instagram" type="text" className="input" placeholder="@handle" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="creator-youtube">YouTube</label>
              <input id="creator-youtube" type="text" className="input" placeholder="Channel URL" value={youtube} onChange={(e) => setYoutube(e.target.value)} />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="creator-followers">Total Followers</label>
            <input id="creator-followers" type="number" className="input" placeholder="e.g. 50000" value={followers} onChange={(e) => setFollowers(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%" }} id="creator-signup-submit">
            {loading ? "Creating account..." : "Create Creator Account"}
          </button>
        </form>

        <p className={styles.authFooter}>
          Already have an account? <Link href="/login/creator">Sign in</Link>
        </p>
        <p className={styles.authFooter} style={{ marginTop: "var(--space-xs)" }}>
          <Link href="/signup/brand">I&apos;m a Brand →</Link>
        </p>
      </div>
    </div>
  );
}

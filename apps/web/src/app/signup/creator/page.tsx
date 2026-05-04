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
  const { registerCreator } = useAuth();
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

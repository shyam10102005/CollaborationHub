"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import styles from "../../login/auth.module.css";

const INDUSTRIES = ["Technology", "E-Commerce", "Fashion & Apparel", "Food & Beverage", "Health & Wellness", "Finance", "Entertainment", "Sports", "Education", "Travel", "Automotive", "Real Estate", "SaaS", "Other"];
const BUDGETS = ["Under $5K", "$5K - $10K", "$10K - $50K", "$50K - $100K", "$100K+"];

export default function BrandSignupPage() {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { registerBrand } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerBrand(email, password, companyName || undefined, industry || undefined, website || undefined, budget || undefined);
      router.push("/brand/dashboard");
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
          <div className={styles.roleBadge} style={{ background: "rgba(0,206,201,0.12)", color: "var(--brand-accent)" }}>🏢 Brand</div>
          <h1 className={styles.title}>Register Brand</h1>
          <p className={styles.subtitle}>Find and collaborate with top creators</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.authForm}>
          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formRow}>
            <div className="input-group">
              <label htmlFor="brand-company">Company Name</label>
              <input id="brand-company" type="text" className="input" placeholder="Your company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="brand-industry">Industry</label>
              <select id="brand-industry" className="input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((ind) => <option key={ind} value={ind.toLowerCase()}>{ind}</option>)}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="brand-email">Email</label>
            <input id="brand-email" type="email" className="input" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-group">
            <label htmlFor="brand-password">Password</label>
            <input id="brand-password" type="password" className="input" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>

          <div className={styles.formRow}>
            <div className="input-group">
              <label htmlFor="brand-website">Website</label>
              <input id="brand-website" type="url" className="input" placeholder="https://company.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="input-group">
              <label htmlFor="brand-budget">Budget Range</label>
              <select id="brand-budget" className="input" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="">Select range</option>
                {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%" }} id="brand-signup-submit">
            {loading ? "Creating account..." : "Register Brand"}
          </button>
        </form>

        <p className={styles.authFooter}>
          Already registered? <Link href="/login/brand">Sign in</Link>
        </p>
        <p className={styles.authFooter} style={{ marginTop: "var(--space-xs)" }}>
          <Link href="/signup/creator">← I&apos;m a Creator</Link>
        </p>
      </div>
    </div>
  );
}

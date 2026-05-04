"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import styles from "./landing.module.css";

const features = [
  { icon: "🔗", title: "Link-in-Bio", desc: "Create a stunning portfolio with real-time analytics and click tracking" },
  { icon: "📅", title: "Content Planner", desc: "Schedule and auto-publish across Instagram, YouTube, TikTok and X" },
  { icon: "✨", title: "AI Assistant", desc: "Generate captions, hashtags, and content strategies with AI" },
  { icon: "🤝", title: "Collaborations", desc: "Find partners, manage deals, and track campaign deliverables" },
  { icon: "💰", title: "Earnings & Payments", desc: "Track revenue, split earnings, and manage Stripe payouts" },
  { icon: "📊", title: "Growth Insights", desc: "AI-driven analytics and audience growth recommendations" },
];

const stats = [
  { value: "10K+", label: "Active Creators" },
  { value: "500+", label: "Brand Partners" },
  { value: "$2M+", label: "Earnings Tracked" },
  { value: "50K+", label: "Collabs Completed" },
];

const testimonials = [
  { name: "Alex Rivera", role: "Fitness Creator", text: "CollabarationOS tripled my brand deal efficiency. The AI suggestions are insane.", avatar: "A" },
  { name: "Sarah Kim", role: "Brand Manager, NovaTech", text: "Finding the right creators used to take weeks. Now it takes minutes.", avatar: "S" },
  { name: "Yuki Tanaka", role: "Fashion Creator", text: "The content planner and link-in-bio tools are the best I've used. Period.", avatar: "Y" },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(user.user_type === "brand" ? "/brand/dashboard" : "/creator/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className={styles.landing}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <Link href="/" className={styles.navLogo}>
            <span className={styles.navLogoIcon}>◈</span>
            <span className={styles.navLogoText}>CollabarationOS</span>
          </Link>
          <div className={styles.navLinks}>
            <Link href="/login/creator" className={styles.navLink}>Creator Login</Link>
            <Link href="/login/brand" className={styles.navLink}>Brand Login</Link>
            <Link href="/signup/creator" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroOrb1} />
          <div className={styles.heroOrb2} />
          <div className={styles.heroOrb3} />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>🚀 The Creator Economy Platform</div>
          <h1 className={styles.heroTitle}>
            All-in-one platform for<br />
            <span className={styles.heroGradient}>Creators & Brands</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Manage collaborations, automate content, track earnings, and grow with AI.
            Everything you need to build your creator business — in one powerful dashboard.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/signup/creator" className={styles.ctaCreator} id="cta-creator">
              <span>🎨</span> Join as Creator
            </Link>
            <Link href="/signup/brand" className={styles.ctaBrand} id="cta-brand">
              <span>🏢</span> Join as Brand
            </Link>
          </div>
          <p className={styles.heroNote}>Free to start · No credit card required</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className={styles.features} id="features">
        <h2 className={styles.sectionTitle}>Everything you need to grow</h2>
        <p className={styles.sectionSubtitle}>
          One platform. Two powerful dashboards. Infinite possibilities.
        </p>
        <div className={styles.featureGrid}>
          {features.map((f, i) => (
            <div key={f.title} className={styles.featureCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How it works</h2>
        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Choose your role</h3>
            <p>Sign up as a Creator or Brand — each gets a tailored dashboard</p>
          </div>
          <div className={styles.stepDivider} />
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Set up your profile</h3>
            <p>Add your niche, portfolio, and social accounts to get discovered</p>
          </div>
          <div className={styles.stepDivider} />
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Start collaborating</h3>
            <p>Connect with partners, manage deals, and grow your business</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>Loved by creators & brands</h2>
        <div className={styles.testimonialGrid}>
          {testimonials.map((t) => (
            <div key={t.name} className={styles.testimonialCard}>
              <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>{t.avatar}</div>
                <div>
                  <div className={styles.testimonialName}>{t.name}</div>
                  <div className={styles.testimonialRole}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to level up?</h2>
        <p className={styles.ctaSubtitle}>Join thousands of creators and brands already growing on CollabarationOS</p>
        <div className={styles.heroCtas}>
          <Link href="/signup/creator" className={styles.ctaCreator}>🎨 Join as Creator</Link>
          <Link href="/signup/brand" className={styles.ctaBrand}>🏢 Join as Brand</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.navLogoIcon}>◈</span>
            <span className={styles.navLogoText}>CollabarationOS</span>
          </div>
          <div className={styles.footerLinks}>
            <Link href="/login/creator">Creator Login</Link>
            <Link href="/login/brand">Brand Login</Link>
            <Link href="/signup/creator">Sign Up</Link>
          </div>
          <p className={styles.footerCopy}>© 2026 CollabarationOS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

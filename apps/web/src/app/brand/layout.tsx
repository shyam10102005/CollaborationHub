"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "../dashboard/dashboard.module.css";

export default function BrandLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login/brand");
    } else if (!loading && user && user.user_type === "creator") {
      router.push("/creator/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}>
          <span className={styles.logoIcon}>◈</span>
        </div>
        <p className={styles.loadingText}>Loading CollabarationOS...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar role="brand" />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

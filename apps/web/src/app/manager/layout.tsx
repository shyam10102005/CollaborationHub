"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import ManagerSidebar from "@/components/ManagerSidebar";
import Header from "@/components/Header";
import styles from "../dashboard/dashboard.module.css";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login/manager");
    } else if (!loading && user && user.user_type !== "manager") {
      // Not a manager — redirect to their appropriate dashboard
      if (user.user_type === "brand") {
        router.push("/brand/dashboard");
      } else {
        router.push("/creator/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner}>
          <span className={styles.logoIcon}>◈</span>
        </div>
        <p className={styles.loadingText}>Loading CollabarationOS Manager...</p>
      </div>
    );
  }

  if (!user || user.user_type !== "manager") return null;

  return (
    <div className={styles.dashboardContainer}>
      <ManagerSidebar />
      <div className={styles.mainArea}>
        <Header />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}

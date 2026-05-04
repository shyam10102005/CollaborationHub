"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import styles from "../../login/auth.module.css";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Fetch user to determine role-based redirect
      api.getMe().then((user) => {
        if (user.user_type === "brand") {
          router.replace("/brand/dashboard");
        } else {
          router.replace("/creator/dashboard");
        }
      }).catch(() => {
        router.replace("/creator/dashboard");
      });
    } else {
      setError("Authentication failed. No tokens received.");
      setTimeout(() => router.replace("/"), 3000);
    }
  }, [searchParams, router]);

  return (
    <div className={styles.authCard}>
      <div className={styles.authHeader}>
        <span className={styles.logo}>◈</span>
        {error ? (
          <>
            <h1 className={styles.title}>Authentication Failed</h1>
            <p className={styles.subtitle}>{error}</p>
            <p className={styles.subtitle} style={{ marginTop: "8px" }}>
              Redirecting...
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Signing you in...</h1>
            <p className={styles.subtitle}>Please wait a moment</p>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className={styles.spinner} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className={styles.authPage}>
      <div className={styles.authBackground}>
        <div className={styles.gradientOrb1} />
        <div className={styles.gradientOrb2} />
        <div className={styles.gradientOrb3} />
      </div>

      <Suspense
        fallback={
          <div className={styles.authCard}>
            <div className={styles.authHeader}>
              <span className={styles.logo}>◈</span>
              <h1 className={styles.title}>Loading...</h1>
              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div className={styles.spinner} />
              </div>
            </div>
          </div>
        }
      >
        <CallbackContent />
      </Suspense>
    </div>
  );
}

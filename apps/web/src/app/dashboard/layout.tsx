"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/");
      } else if (user.user_type === "brand") {
        router.replace("/brand/dashboard");
      } else {
        router.replace("/creator/dashboard");
      }
    }
  }, [user, loading, router]);

  return <>{children}</>;
}

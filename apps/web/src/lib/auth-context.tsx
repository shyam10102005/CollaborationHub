"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  registerCreator: (
    email: string,
    password: string,
    displayName?: string,
    niche?: string,
    socialLinks?: Record<string, string>,
    followerCount?: number,
  ) => Promise<void>;
  registerBrand: (
    email: string,
    password: string,
    companyName?: string,
    industry?: string,
    website?: string,
    budgetRange?: string,
  ) => Promise<void>;

  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }
      const userData = await api.getMe();
      setUser(userData);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string): Promise<User> => {
    const tokens = await api.login(email, password);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    const userData = await api.getMe();
    setUser(userData);
    return userData;
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const tokens = await api.register(email, password, displayName);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    await fetchUser();
  };

  const registerCreator = async (
    email: string,
    password: string,
    displayName?: string,
    niche?: string,
    socialLinks?: Record<string, string>,
    followerCount?: number,
  ) => {
    const tokens = await api.registerCreator(email, password, displayName, niche, socialLinks, followerCount);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    await fetchUser();
  };

  const registerBrand = async (
    email: string,
    password: string,
    companyName?: string,
    industry?: string,
    website?: string,
    budgetRange?: string,
  ) => {
    const tokens = await api.registerBrand(email, password, companyName, industry, website, budgetRange);
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    await fetchUser();
  };


  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, registerCreator, registerBrand, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

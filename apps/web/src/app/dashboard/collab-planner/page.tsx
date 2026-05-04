"use client";
import React from "react";
import styles from "../dashboard.module.css";

export default function CollabPlannerPage() {
  const events = [
    { day: 1, title: "Script review with Alex", time: "10:00 AM", type: "review" },
    { day: 2, title: "Joint shoot day 📸", time: "2:00 PM", type: "shoot" },
    { day: 3, title: "Edit handoff deadline", time: "6:00 PM", type: "deadline" },
    { day: 5, title: "Cross-post: Instagram Reel", time: "9:00 AM", type: "publish" },
    { day: 5, title: "Cross-post: YouTube Short", time: "12:00 PM", type: "publish" },
  ];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const typeColors: Record<string,string> = { review: "var(--brand-primary)", shoot: "var(--brand-accent)", deadline: "var(--brand-warning)", publish: "var(--brand-success)" };

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>📋 Collab Planner</h1>
        <p className={styles.pageSubtitle}>Shared calendars and cross-posting schedules</p>
      </div>
      <div className="glass-card" style={{ padding: "var(--space-xl)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--space-sm)" }}>
          {days.map((day, i) => (
            <div key={day}>
              <div style={{ textAlign: "center", padding: "var(--space-sm)", fontWeight: 600, fontSize: "var(--font-size-sm)", color: "var(--text-muted)", borderBottom: "1px solid var(--border-subtle)", marginBottom: "var(--space-sm)" }}>{day}</div>
              <div style={{ minHeight: 200, display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                {events.filter(e => e.day === i).map((ev, j) => (
                  <div key={j} style={{ padding: "var(--space-sm)", borderRadius: "var(--radius-sm)", background: `${typeColors[ev.type]}15`, borderLeft: `3px solid ${typeColors[ev.type]}`, fontSize: "var(--font-size-xs)" }}>
                    <div style={{ fontWeight: 600 }}>{ev.title}</div>
                    <div style={{ color: "var(--text-muted)" }}>{ev.time}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

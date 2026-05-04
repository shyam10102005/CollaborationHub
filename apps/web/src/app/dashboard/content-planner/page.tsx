"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

const samplePosts = [
  { id: "1", platform: "instagram", title: "Summer collection reveal", time: "10:00", day: 1, status: "scheduled", type: "Reel" },
  { id: "2", platform: "youtube", title: "Behind the scenes vlog", time: "14:00", day: 3, status: "draft", type: "Video" },
  { id: "3", platform: "x", title: "Thread: Creator tips", time: "09:00", day: 2, status: "published", type: "Thread" },
  { id: "4", platform: "instagram", title: "Collab announcement", time: "18:00", day: 5, status: "scheduled", type: "Post" },
  { id: "5", platform: "youtube", title: "Product review", time: "12:00", day: 4, status: "draft", type: "Short" },
];

const platformColors: Record<string, string> = {
  instagram: "#E1306C",
  youtube: "#FF0000",
  x: "#1DA1F2",
  tiktok: "#00F2EA",
};

const statusColors: Record<string, string> = {
  draft: "badge-warning",
  scheduled: "badge-primary",
  published: "badge-success",
  failed: "badge-danger",
};

export default function ContentPlannerPage() {
  const [view, setView] = useState<"week" | "list">("week");
  const [showComposer, setShowComposer] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className={styles.pageHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 className={styles.pageTitle}>📅 Content Planner</h1>
            <p className={styles.pageSubtitle}>Schedule and publish across all platforms</p>
          </div>
          <div style={{ display: "flex", gap: "var(--space-sm)" }}>
            <div style={{ display: "flex", background: "var(--bg-glass)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)" }}>
              <button className={`btn btn-sm ${view === "week" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("week")}>Week</button>
              <button className={`btn btn-sm ${view === "list" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("list")}>List</button>
            </div>
            <button className="btn btn-primary" onClick={() => setShowComposer(!showComposer)}>+ New Post</button>
          </div>
        </div>
      </div>

      {/* Quota indicators */}
      <div className={styles.statsGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { platform: "Instagram", used: 12, limit: 25, color: "#E1306C" },
          { platform: "YouTube", used: 3, limit: 6, color: "#FF0000" },
          { platform: "X", used: 45, limit: 300, color: "#1DA1F2" },
        ].map((q) => (
          <div key={q.platform} className="glass-card" style={{ padding: "var(--space-md)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-sm)" }}>
              <span style={{ fontSize: "var(--font-size-sm)", fontWeight: 600 }}>{q.platform}</span>
              <span style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>{q.used}/{q.limit} today</span>
            </div>
            <div style={{ height: 6, background: "var(--bg-glass)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(q.used / q.limit) * 100}%`, background: q.color, borderRadius: "var(--radius-full)", transition: "width 0.5s ease" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Composer Modal */}
      {showComposer && (
        <div className="glass-card" style={{ padding: "var(--space-xl)", marginBottom: "var(--space-xl)" }}>
          <h3 style={{ fontWeight: 700, marginBottom: "var(--space-md)" }}>Create Post</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-md)" }}>
            <div className="input-group">
              <label>Platform</label>
              <select className="input" id="post-platform">
                <option>Instagram</option>
                <option>YouTube</option>
                <option>X (Twitter)</option>
                <option>TikTok</option>
              </select>
            </div>
            <div className="input-group">
              <label>Content Type</label>
              <select className="input" id="post-type">
                <option>Post</option>
                <option>Reel</option>
                <option>Story</option>
                <option>Video</option>
              </select>
            </div>
            <div className="input-group" style={{ gridColumn: "1 / -1" }}>
              <label>Caption</label>
              <textarea className="input" rows={3} placeholder="Write your caption... or use AI ✨" id="post-caption" style={{ resize: "vertical" }} />
            </div>
            <div className="input-group">
              <label>Schedule Date</label>
              <input type="datetime-local" className="input" id="post-schedule" />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "var(--space-sm)" }}>
              <button className="btn btn-primary">Schedule</button>
              <button className="btn btn-secondary">Save Draft</button>
              <button className="btn btn-ghost" onClick={() => setShowComposer(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar View */}
      {view === "week" ? (
        <div className="glass-card" style={{ padding: "var(--space-md)", overflow: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: "1px", minWidth: "700px" }}>
            <div />
            {days.map((day) => (
              <div key={day} style={{ textAlign: "center", padding: "var(--space-sm)", fontWeight: 600, fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>
                {day}
              </div>
            ))}
            {hours.filter((_, i) => i >= 6 && i <= 22).map((hour) => (
              <React.Fragment key={hour}>
                <div style={{ padding: "var(--space-xs)", fontSize: "var(--font-size-xs)", color: "var(--text-muted)", textAlign: "right", paddingRight: "var(--space-sm)" }}>
                  {hour}
                </div>
                {days.map((_, dayIdx) => {
                  const postsHere = samplePosts.filter(
                    (p) => p.day === dayIdx && p.time === hour
                  );
                  return (
                    <div key={`${hour}-${dayIdx}`} style={{
                      minHeight: 40,
                      borderTop: "1px solid var(--border-subtle)",
                      padding: "2px",
                    }}>
                      {postsHere.map((post) => (
                        <div key={post.id} style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "var(--font-size-xs)",
                          fontWeight: 600,
                          background: `${platformColors[post.platform]}20`,
                          borderLeft: `3px solid ${platformColors[post.platform]}`,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {post.title}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          {samplePosts.map((post, i) => (
            <div key={post.id} className="glass-card" style={{
              padding: "var(--space-md)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-md)",
              animation: `fadeIn 0.3s ease-out ${i * 0.05}s both`,
            }}>
              <div style={{ width: 4, height: 40, borderRadius: 2, background: platformColors[post.platform] }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: "var(--font-size-sm)" }}>{post.title}</div>
                <div style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)" }}>
                  {post.platform} • {post.type} • {days[post.day]} {post.time}
                </div>
              </div>
              <span className={`badge ${statusColors[post.status]}`}>{post.status}</span>
              <button className="btn btn-ghost btn-sm">✏️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

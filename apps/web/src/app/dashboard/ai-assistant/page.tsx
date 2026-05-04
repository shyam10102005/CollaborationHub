"use client";

import React, { useState } from "react";
import styles from "../dashboard.module.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const sampleResponses: Record<string, string> = {
  caption: "✨ Here's a caption for your Instagram Reel:\n\n\"The best part about creating content? Every day is a chance to inspire. 🎬\n\nNew behind-the-scenes just dropped — swipe to see the magic unfold ✨\n\nDrop a 🔥 if you want more BTS content!\"\n\n#ContentCreator #BTS #CreatorLife #Reels #InspirationDaily",
  hashtags: "📌 Optimized hashtags for fitness content:\n\n**High Reach (100K+):**\n#FitnessMotivation #WorkoutRoutine #FitLife\n\n**Medium Reach (10K-100K):**\n#HomeWorkoutTips #FitnessTips2026 #GymLifestyle\n\n**Niche (1K-10K):**\n#KettlebellWorkout #FunctionalFitness #StrengthTraining",
  ideas: "💡 Content ideas for this week:\n\n1. **\"Day in my life\" Reel** — Show your morning routine + content creation process. High save rate format.\n\n2. **Carousel: Top 5 Tools** — Share your favorite creator tools. Carousel posts get 2.3x more engagement.\n\n3. **Collab Series** — Partner with @creator for a challenge video. Cross-pollination opportunity.\n\n4. **Story Poll** — \"Which content do you want next?\" Boosts engagement algorithm signals.\n\n5. **YouTube Short** — Repurpose your best Reel with a new hook. Different audience segment.",
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! 👋 I'm your AI Content Assistant powered by local LLM inference. I can generate captions, optimize hashtags, brainstorm content ideas, and more. What would you like help with?" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let response = "I'd be happy to help! Could you be more specific? I can:\n\n• Generate **captions** for any platform\n• Suggest optimized **hashtags**\n• Brainstorm **content ideas**\n• Analyze your content **strategy**\n\nTry asking: \"Write a caption for my Instagram Reel about travel\"";

      if (lower.includes("caption")) response = sampleResponses.caption;
      else if (lower.includes("hashtag")) response = sampleResponses.hashtags;
      else if (lower.includes("idea") || lower.includes("suggest")) response = sampleResponses.ideas;

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="animate-fade-in" style={{ height: "calc(100vh - var(--header-height) - var(--space-xl) * 2)", display: "flex", flexDirection: "column" }}>
      <div className={styles.pageHeader} style={{ marginBottom: "var(--space-md)" }}>
        <h1 className={styles.pageTitle}>✨ AI Content Assistant</h1>
        <p className={styles.pageSubtitle}>Powered by local LLM inference (Ollama + llama3.2)</p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-md)", flexWrap: "wrap" }}>
        {[
          { label: "📝 Generate Caption", prompt: "Write a caption for my latest Instagram Reel" },
          { label: "#️⃣ Suggest Hashtags", prompt: "Suggest optimized hashtags for fitness content" },
          { label: "💡 Content Ideas", prompt: "Suggest content ideas for this week" },
          { label: "📊 Analyze Strategy", prompt: "Analyze my content strategy and suggest improvements" },
        ].map((action) => (
          <button key={action.label} className="btn btn-secondary btn-sm" onClick={() => sendMessage(action.prompt)}>
            {action.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="glass-card" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ flex: 1, overflow: "auto", padding: "var(--space-lg)" }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: "var(--space-md)",
              animation: `fadeIn 0.3s ease-out`,
            }}>
              <div style={{
                maxWidth: "70%",
                padding: "var(--space-md)",
                borderRadius: "var(--radius-lg)",
                background: msg.role === "user"
                  ? "linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))"
                  : "var(--bg-glass)",
                border: msg.role === "assistant" ? "1px solid var(--border-subtle)" : "none",
                fontSize: "var(--font-size-sm)",
                lineHeight: 1.6,
                whiteSpace: "pre-wrap",
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: "var(--space-md)" }}>
              <div className="glass-card" style={{ padding: "var(--space-md)", fontSize: "var(--font-size-sm)" }}>
                <span style={{ animation: "pulse 1s infinite" }}>✨ Generating response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "var(--space-md)", borderTop: "1px solid var(--border-subtle)", display: "flex", gap: "var(--space-sm)" }}>
          <input
            id="ai-chat-input"
            type="text"
            className="input"
            style={{ flex: 1 }}
            placeholder="Ask me to generate captions, hashtags, or content ideas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          />
          <button className="btn btn-primary" onClick={() => sendMessage(input)} id="ai-send-btn">
            Send ↑
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { MoodOptions, CategoryOptions } from "../data";
import type { Phrase } from "../../../../models/TextTyping";
import { useEffect } from "react";

interface SideNavProps {
  phrase: string[];
  setPhrase: React.Dispatch<React.SetStateAction<string[]>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  mood: string;
  setMood: React.Dispatch<React.SetStateAction<string>>;
  handleAISuggestion: () => void;
  setPhraseData: React.Dispatch<React.SetStateAction<Phrase>>;
  isGenerating: boolean;
}

export const PhraseSideNav: React.FC<SideNavProps> = ({
  phrase,
  setPhrase,
  category,
  setCategory,
  mood,
  setMood,
  setPhraseData,
  handleAISuggestion,
  isGenerating,
}) => {
  useEffect(() => {
    setPhraseData({
      lines: phrase,
      category,
      mood,
    });
  }, [phrase, category, mood, setPhraseData]);
  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
      }}
    >
      {/* 🎭 Mood Selection */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Mood</h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#666",
            marginBottom: "0.75rem",
          }}
        >
          Select the mood that best matches the tone of your phrase.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {MoodOptions.map((m) => {
            const isSelected = mood === m;
            return (
              <button
                key={m}
                onClick={() => setMood(m)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  border: isSelected ? "2px solid #0077ff" : "1px solid #ddd",
                  background: isSelected ? "#e6f0ff" : "#fafafa",
                  color: isSelected ? "#0077ff" : "#333",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontWeight: isSelected ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📂 Category Selection */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Category</h3>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#666",
            marginBottom: "0.75rem",
          }}
        >
          Choose a category to organize or theme your phrase.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          {CategoryOptions.map((cat) => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "20px",
                  border: isSelected ? "2px solid #ff4fa3" : "1px solid #ddd",
                  background: isSelected ? "#ffe6f2" : "#fafafa",
                  color: isSelected ? "#ff4fa3" : "#333",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  fontWeight: isSelected ? 600 : 400,
                  transition: "all 0.2s",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ✍️ Phrase Input */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
          Phrase Content
        </h3>
        <label style={{ display: "block", marginBottom: "1rem" }}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
            Enter each line (press Enter for new line)
          </div>
          <textarea
            value={phrase.join("\n")}
            onChange={(e) => setPhrase(e.target.value.split("\n"))}
            style={{
              width: "100%",
              height: 120,
              padding: "0.8rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "#fafafa",
              fontSize: 14,
              lineHeight: 1.5,
            }}
          />
        </label>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          Each line will be typed separately in the animation.
        </p>
      </div>

      {/* 🤖 AI Generate Button */}
      <div
        style={{
          padding: "1rem",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: "1px solid #eee",
        }}
      >
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>AI Tools</h3>
        <p
          style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.5rem" }}
        >
          Let AI generate a new phrase for you.
        </p>
        <button
          onClick={handleAISuggestion}
          style={{
            marginTop: "0.5rem",
            padding: "0.6rem 1rem",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            color: "white",
            fontWeight: 600,
            background: isGenerating
              ? "#999"
              : "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            width: "100%",
          }}
        >
          {isGenerating ? "⏳ Generating Phrase..." : "✨ Generate with AI"}
        </button>
      </div>
    </div>
  );
};

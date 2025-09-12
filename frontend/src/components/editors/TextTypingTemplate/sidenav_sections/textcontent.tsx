import type React from "react";

export interface QuoteProps {
  textcontent: string;
  setTextContent: React.Dispatch<React.SetStateAction<string>>;
  handleAISuggestion: () => void;
  aiprompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export const TextContentSection: React.FC<QuoteProps> = ({
  setTextContent,
  textcontent,
  aiprompt,
  setPrompt,
  handleAISuggestion,
}) => {
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
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>
        Text Content
      </h3>

      {/* User-provided text */}
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
          Text Typing Content
        </div>
        <textarea
          value={textcontent}
          onChange={(e) => setTextContent(e.target.value)}
          style={{
            width: "100%",
            height: 150,
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 14,
          }}
        />
      </label>
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-0.5rem" }}>
        This is the actual text that will appear in your typing animation.  
        You can paste a quote, script, or any custom message here.
      </p>

      {/* AI prompt input */}
      <label style={{ display: "block", marginBottom: "1rem", marginTop: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
          Enter your prompt here
        </div>
        <textarea
          value={aiprompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 16,
          }}
        />
      </label>
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-0.5rem" }}>
        Describe the kind of text you want AI to generate.  
      </p>

      {/* 🚀 Generate AI Quote Button */}
      <button
        onClick={() => {
          handleAISuggestion();
        }}
        style={{
          marginTop: "0.75rem",
          padding: "0.6rem 1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontWeight: 600,
          background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "100%",
        }}
      >
        ✨ Generate Text Content using AI
      </button>
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
        Click this button to let AI suggest text based on your prompt above.  
        You can always edit or refine the result afterward.
      </p>
    </div>
  );
};

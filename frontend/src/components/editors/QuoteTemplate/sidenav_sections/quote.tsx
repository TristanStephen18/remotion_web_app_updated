import type React from "react";

export interface QuoteProps {
  quote: string;
  author: string;
  setQuote: React.Dispatch<React.SetStateAction<string>>;
  setAuthor: React.Dispatch<React.SetStateAction<string>>;
  handleAISuggestion: () => void;
}

export const QuoteSecTrial: React.FC<QuoteProps> = ({
  setAuthor,
  setQuote,
  author,
  quote,
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
        Quote Content
      </h3>

      {/* Quote Field */}
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>Quote</div>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="e.g. The best way to predict the future is to create it."
          style={{
            width: "100%",
            height: 200,
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 17,
            fontWeight: "bold",
          }}
        />
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.4rem" }}>
          Enter the main quote or saying you'd like to display. Try keeping it
          concise and impactful.
        </p>
      </label>

      {/* Author Field */}
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>Author</div>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="e.g. Abraham Lincoln"
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 17,
          }}
        />
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.4rem" }}>
          Add the name of the person who said the quote. Leave blank if it's
          unknown or if you want it to appear anonymous.
        </p>
      </label>

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
        ✨ Generate Quote using AI
      </button>

      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.75rem" }}>
        Generate Random Quotes with AI
      </p>
    </div>
  );
};

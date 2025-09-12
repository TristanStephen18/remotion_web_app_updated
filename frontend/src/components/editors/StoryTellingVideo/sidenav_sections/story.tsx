import React from "react";

export interface StoryPanelProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  genres: string[];
  setGenres: React.Dispatch<React.SetStateAction<string[]>>;
  story: string;
  setStory: React.Dispatch<React.SetStateAction<string>>;
  fetchAiStory: () => Promise<void>;
  isGenerating: boolean;
}

export const StorySidePanel: React.FC<StoryPanelProps> = ({
  prompt,
  setPrompt,
  genres,
  setGenres,
  story,
  setStory,
  fetchAiStory,
  isGenerating,
}) => {
  const toggleGenre = (genre: string) => {
    if (genres.includes(genre)) {
      setGenres(genres.filter((g) => g !== genre));
    } else {
      setGenres([...genres, genre]);
    }
  };

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
      <h3 style={{ marginBottom: "1rem", color: "#0077ff" }}>📖 Story Builder</h3>

      {/* Genres */}
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
          Choose Genres
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          {[
            "Fantasy",
            "Sci-Fi",
            "Romance",
            "Horror",
            "Mystery",
            "Adventure",
          ].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => toggleGenre(g)}
              style={{
                padding: "0.4rem 0.8rem",
                borderRadius: "20px",
                border: "1px solid #0077ff",
                background: genres.includes(g) ? "#0077ff" : "#fff",
                color: genres.includes(g) ? "#fff" : "#0077ff",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {g}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "0.85rem", color: "#666" }}>
          Pick one or more genres. Leave empty if you want a general story.
        </p>
      </label>

      {/* Prompt */}
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
          Add specifications
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Make the story about a time-traveling detective."
          style={{
            width: "100%",
            height: 100,
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 15,
          }}
        />
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.4rem" }}>
          Optional. Add context or constraints to shape the AI story.
        </p>
      </label>

      {/* Generate Button */}
      <button
        onClick={fetchAiStory}
        disabled={isGenerating}
        style={{
          marginTop: "0.5rem",
          marginBottom: "1rem",
          padding: "0.8rem 1rem",
          borderRadius: "8px",
          border: "none",
          cursor: isGenerating ? "not-allowed" : "pointer",
          color: "white",
          fontWeight: 600,
          background: isGenerating
            ? "#999"
            : "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: isGenerating ? "none" : "0 4px 12px rgba(0,0,0,0.2)",
          width: "100%",
        }}
      >
        {isGenerating ? "⏳ Creating..." : "✨ Create My Story"}
      </button>
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.3rem" }}>
        Click to generate a story with AI. The result will appear below — you can
        then edit it manually.
      </p>

      {/* Story Field */}
      <label style={{ display: "block", marginTop: "1.5rem" }}>
        <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
          Story Content
        </div>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          placeholder="Your story will appear here. You can also type your own."
          style={{
            width: "100%",
            height: 200,
            padding: "0.8rem",
            borderRadius: "8px",
            border: "1px solid #ddd",
            background: "#fafafa",
            fontSize: 16,
            fontWeight: 500,
          }}
        />
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.4rem" }}>
          This is your final story. AI output is placed here, but you can freely
          edit or replace it with your own writing.
        </p>
      </label>
    </div>
  );
};

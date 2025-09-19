type RedditFetcherSidepanelProps = {
  url: string;
  setUrl: (url: string) => void;
  loading: boolean;
  error: string | null;
  post: { title: string; selftext: string; author?: string } | null;
  onFetch: (url: string) => void;
};

export const RedditFetcherSidepanel: React.FC<RedditFetcherSidepanelProps> = ({
  url,
  setUrl,
  loading,
  error,
  post,
  onFetch,
}) => {
  return (
    <div
      style={{
        marginTop: "40px",
        width: "100%", // always takes parent width
        maxWidth: "100%",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(12,24,48,0.06)",
        border: "1px solid #eef2ff",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* Heading with gradient */}
      <h3
        style={{
          margin: 0,
          fontSize: "1.2rem",
          fontWeight: 700,
          background: "linear-gradient(90deg, #ff4fa3, #0077ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🔗 Fetch Reddit Post
      </h3>

      {/* Input + Button Row */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Paste Reddit post URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            flex: "1 1 auto",
            minWidth: "200px",
            padding: "0.6rem 0.8rem",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
            outline: "none",
            transition: "border 0.2s",
          }}
          onFocus={(e) => (e.target.style.border = "1px solid #ff4fa3")}
          onBlur={(e) => (e.target.style.border = "1px solid #ddd")}
        />
        <button
          onClick={() => onFetch(url)}
          disabled={!url.trim() || loading}
          style={{
            padding: "0.6rem 1.2rem",
            background: loading
              ? "#ccc"
              : "linear-gradient(90deg, #ff4fa3, #0077ff)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: 600,
            flexShrink: 0,
            minWidth: "80px",
            transition: "opacity 0.2s, transform 0.1s",
          }}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "scale(0.96)")
          }
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {loading ? "..." : "Fetch"}
        </button>
      </div>

      {/* Status Messages */}
      {loading && <p style={{ fontSize: 13, color: "#666" }}>Fetching post...</p>}
      {error && <p style={{ fontSize: 13, color: "red" }}>{error}</p>}

      {/* Post Display */}
      {post && (
        <div
          style={{
            background: "#fdfdff",
            border: "1px solid #e0e6ff",
            borderRadius: 8,
            padding: "1rem",
            fontFamily: "Inter, sans-serif",
            maxHeight: "50vh",
            overflowY: "auto",
          }}
        >
          <h4
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: 16,
              color: "#1a1a1a",
              lineHeight: 1.4,
            }}
          >
            {post.title}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#444",
              whiteSpace: "pre-line",
              lineHeight: 1.5,
            }}
          >
            {post.selftext || "(No text content)"}
          </p>
          {post.author && (
            <p
              style={{
                fontSize: 12,
                marginTop: "0.75rem",
                background: "linear-gradient(90deg, #ff4fa3, #0077ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 500,
              }}
            >
              Posted by u/{post.author}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

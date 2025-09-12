import type React from "react";

export interface ExportProps {
  handleExport: (format: string) => void;
  isExporting: string | null;
}

export const ExportSecTrial: React.FC<ExportProps> = ({
  isExporting,
  handleExport,
}) => {
  const buttonStyle = (color: string, active: boolean) => ({
    padding: "0.8rem",
    borderRadius: "8px",
    border: "none",
    background: active ? "#ccc" : color,
    color: "white",
    fontWeight: 600,
    cursor: active ? "not-allowed" : "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    transition: "transform 0.2s",
    opacity: active ? 0.7 : 1,
  });

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
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Export</h3>
      <div
        style={{
          background: "#f5f9ff",
          border: "1px solid #d6e3ff",
          borderRadius: 8,
          padding: "12px 14px",
          marginBottom: 20,
          fontSize: 14,
          lineHeight: 1.5,
          color: "#333",
        }}
      >
        <strong style={{ color: "#0b63ff" }}>Choose a format for the exported output of your project</strong>
        <ul style={{ margin: "8px 0 0 20px", padding: 0 }}>
        <li>MP4 is the most common and reliable video file, perfect for storing and sharing high-quality movies with sound.</li>
        <li>GIF is a short, soundless looping image sequence, primarily used for simple animations and reaction memes.</li>
        <li>WebM is a modern, efficient video format designed for the web, offering fast loading and high quality with sound.</li>
      </ul>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {/* MP4 */}
        <button
          onClick={() => handleExport("mp4")}
          disabled={isExporting !== null}
          style={buttonStyle(
            "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
            isExporting === "mp4"
          )}
        >
          {isExporting === "mp4" ? "🔄 Exporting..." : "🎥 Export as MP4"}
        </button>

        {/* GIF */}
        <button
          onClick={() => handleExport("gif")}
          disabled={isExporting !== null}
          style={buttonStyle("#ff4fa3", isExporting === "gif")}
        >
          {isExporting === "gif" ? "🔄 Exporting..." : "🖼️ Export as GIF"}
        </button>

        {/* WebM */}
        <button
          onClick={() => handleExport("webm")}
          disabled={isExporting !== null}
          style={buttonStyle("#0077ff", isExporting === "webm")}
        >
          {isExporting === "webm" ? "🔄 Exporting..." : "🌐 Export as WebM"}
        </button>
      </div>
    </div>
  );
};

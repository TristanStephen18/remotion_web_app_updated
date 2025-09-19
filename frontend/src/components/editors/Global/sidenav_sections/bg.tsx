import type React from "react";
import { useState } from "react";

export interface BgProps {
  backgroundSource: string;
  setBackgroundSource: React.Dispatch<React.SetStateAction<"upload" | "default">>;
  backgroundImage: string;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
  isUploading: boolean;
  handleFileUpload: (file: File) => void;
}

const TABS = ["philosophy", "colors", "sceneries"];

export const BackgroundSecTrial: React.FC<BgProps> = ({
  backgroundImage,
  backgroundSource,
  handleFileUpload,
  isUploading,
  setBackgroundImage,
  setBackgroundSource,
}) => {
  const [activeTab, setActiveTab] = useState<string>("philosophy");

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
      <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Background</h3>

      {/* Choice Toggle */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="radio"
            checked={backgroundSource === "upload"}
            onChange={() => setBackgroundSource("upload")}
          />
          Upload
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="radio"
            checked={backgroundSource === "default"}
            onChange={() => setBackgroundSource("default")}
          />
          Default
        </label>
      </div>
      <p style={{ fontSize: "0.85rem", color: "#666", marginBottom: "1rem" }}>
        Choose whether to upload your own background or pick from our ready-made collection.
      </p>

      {/* Upload input */}
      {backgroundSource === "upload" && (
        <>
          <label
            style={{
              display: "block",
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              cursor: isUploading ? "not-allowed" : "pointer",
              color: "white",
              fontWeight: 600,
              background: isUploading
                ? "#ccc"
                : "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              textAlign: "center",
              opacity: isUploading ? 0.7 : 1,
            }}
          >
            {isUploading ? "🔄 Uploading..." : "📤 Upload Background Image"}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              disabled={isUploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
            />
          </label>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
            Upload a JPG or PNG image to fully customize your background.
          </p>

          {/* Show current image preview */}
          {backgroundImage && (
            <div style={{ marginTop: "1rem" }}>
              <div
                style={{
                  marginBottom: "0.3rem",
                  color: "#ff4fa3",
                  fontSize: "0.9rem",
                }}
              >
                Current Image:
              </div>
              <img
                src={backgroundImage}
                alt="Background preview"
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
              <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.3rem" }}>
                Preview of the image currently applied as your background.
              </p>
            </div>
          )}
        </>
      )}

      {/* Default backgrounds */}
      {backgroundSource === "default" && (
        <div>
          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              borderBottom: "1px solid #eee",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  background: activeTab === tab ? "#0077ff" : "transparent",
                  color: activeTab === tab ? "#fff" : "#555",
                  fontWeight: 600,
                  borderRadius: "6px 6px 0 0",
                  cursor: "pointer",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Images grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
              gap: "0.75rem",
            }}
          >
            {Array.from({ length: 21 }).map((_, i) => {
              const imgUrl = `/bgimages/${activeTab}/bg${i + 1}.jpg`;
              return (
                <img
                  key={i}
                  src={imgUrl}
                  alt={`bg${i + 1}`}
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    border:
                      backgroundImage === imgUrl
                        ? "3px solid #0077ff"
                        : "1px solid #ddd",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onClick={() => setBackgroundImage(imgUrl)}
                />
              );
            })}
          </div>
          <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.75rem" }}>
            Click on any image to instantly apply it as your background.
          </p>
        </div>
      )}
    </div>
  );
};

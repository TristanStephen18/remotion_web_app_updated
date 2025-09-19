import type React from "react";
import { useState } from "react";

export interface BgProps {
  bottomVideoUrl: string;
  setBottomVideoUrl: React.Dispatch<React.SetStateAction<string>>;
}

const TABS = ["minecraft", "subwaysurfers", "templerun", "ugc"];

export const BottomVideoSelectorPanel: React.FC<BgProps> = ({
  bottomVideoUrl,
  setBottomVideoUrl,
}) => {
  const [activeTab, setActiveTab] = useState<string>("minecraft");

  const getVideosForTab = (tab: string) => {
    const videoCounts: Record<string, number> = {
      minecraft: 8,
      subwaysurfers: 7,
      templerun: 3,
      ugc: 5
    };
    
    const videos = [];
    for (let i = 1; i <= videoCounts[tab]; i++) {
      const prefix = tab === "minecraft" ? "m" : 
                    tab === "subwaysurfers" ? "ss" : 
                    tab === "templerun" ? "tr" : "ugc";
      videos.push(`/defaultvideos/${tab}/${prefix}${i}.mp4`);
    }
    return videos;
  };

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "clamp(0.75rem, 2vw, 1rem)",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        border: "1px solid #eee",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ 
        marginBottom: "0.75rem", 
        color: "#0077ff",
        fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)"
      }}>
        Select your other video
      </h3>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "0.5rem",
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "0.4rem 0.8rem",
              border: "none",
              background: activeTab === tab ? "#0077ff" : "transparent",
              color: activeTab === tab ? "#fff" : "#555",
              fontWeight: 600,
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "clamp(0.7rem, 2vw, 0.85rem)",
              whiteSpace: "nowrap",
              flex: "1 0 auto",
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Videos grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gap: "0.75rem",
        }}
      >
        {getVideosForTab(activeTab).map((videoUrl, i) => (
          <div
            key={i}
            style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              border: bottomVideoUrl === videoUrl ? "3px solid #0077ff" : "1px solid #ddd",
              cursor: "pointer",
              transition: "transform 0.2s ease",
              aspectRatio: "16/9",
            }}
            onClick={() => setBottomVideoUrl(videoUrl)}
          >
            <video
              src={videoUrl}
              muted
              autoPlay
              loop
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                color: "white",
                fontSize: "clamp(8px, 1.5vw, 10px)",
                padding: "2%",
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {videoUrl.split('/').pop()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
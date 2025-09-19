import React from "react";
import { Player } from "@remotion/player";
import { ChatVideo2 } from "../../remotion_compositions/FakeChatConversation";
// import { chats } from "../../editors/FakeTextConversation/defaultdata";

// Wrapper for passing props into ChatVideo2
const ChatVideoComponent: React.FC<{
  chatdata?: any;
  bgVideo?: string;
  chatAudio?: string;
  musicAudio?: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  chatTheme?: "default" | "discord" | "messenger" | "whatsapp";
  timeShiftSec?: number;
  avatars?: { left?: string; right?: string };
}> = ({
  chatdata,
  bgVideo,
  chatAudio,
  musicAudio,
  fontFamily,
  fontSize,
  fontColor,
  chatTheme,
  timeShiftSec,
  avatars,
}) => {
  return (
    <ChatVideo2
      chatdata={chatdata}
      bgVideo={bgVideo}
      chatAudio={chatAudio}
      musicAudio={musicAudio}
      fontFamily={fontFamily}
      fontSize={fontSize}
      fontColor={fontColor}
      chatTheme={chatTheme}
      timeShiftSec={timeShiftSec}
      avatars={avatars}
    />
  );
};

// Player wrapper
const RemotionChatPlayer: React.FC<{
  chatdata?: any;
  bgVideo?: string;
  chatAudio?: string;
  musicAudio?: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  chatTheme?: "default" | "discord" | "messenger" | "whatsapp";
  timeShiftSec?: number;
  avatars?: { left?: string; right?: string };
  duration: number;
}> = ({
  chatdata,
  bgVideo,
  chatAudio,
  musicAudio,
  fontFamily,
  fontSize,
  fontColor,
  chatTheme,
  timeShiftSec,
  avatars,
  duration,
}) => {
  return (
    <Player
      component={ChatVideoComponent}
      inputProps={{
        chatdata,
        bgVideo,
        chatAudio,
        musicAudio,
        fontFamily,
        fontSize,
        fontColor,
        chatTheme,
        timeShiftSec,
        avatars,
      }}
      initiallyMuted
      durationInFrames={30 * duration}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={30}
      controls
      autoPlay
      loop
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

// Final Preview component
export const ChatVideoPreview: React.FC<{
  duration: number;
  previewBg: string;
  cycleBg: () => void;
  previewScale: number;

  // 👇 forward all props you want to control live
  chatdata: any;
  avatars?: { left?: string; right?: string };
  bgVideo?: string;
  chatAudio?: string;
  musicAudio?: string;
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  chatTheme?: "default" | "discord" | "messenger" | "whatsapp";
  timeShiftSec?: number;
    showSafeMargins:boolean;
      onPreviewScaleChange: (value: number) => void; 
  onToggleSafeMargins: (value: boolean) => void; 
}> = ({
  duration,
  previewBg,
  cycleBg,
  previewScale,
  chatdata,
  avatars,
  bgVideo,
  chatAudio,
  musicAudio,
  fontFamily,
  fontSize,
  fontColor,
  chatTheme,
  timeShiftSec,
  showSafeMargins,
  onPreviewScaleChange,
  onToggleSafeMargins
}) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          previewBg === "dark"
            ? "#000"
            : previewBg === "light"
            ? "#f0f0f0"
            : "#ccc",
        transition: "background 0.3s",
        position: "relative",
      }}
    >
      {/* Background toggle button */}
      <button
        onClick={cycleBg}
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          padding: "0.6rem 1rem",
          borderRadius: "30px",
          border: "none",
          cursor: "pointer",
          color: "white",
          fontWeight: 600,
          background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        {previewBg === "dark"
          ? "🌞 Light"
          : previewBg === "light"
          ? "⬜ Grey"
          : "🌙 Dark"}
      </button>

      {/* Checkbox for Safe Margins */}
      <label
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          color: "#fff",
          fontSize: "0.85rem",
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={showSafeMargins}
          onChange={(e) => onToggleSafeMargins(e.target.checked)}
        />
        Show margins
      </label>

      {/* Scale controls (+ / - buttons) */}
      <div
        style={{
          position: "absolute",
          bottom: "70px", // just above the theme toggle button
          right: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
        }}
      >
        <button
          title="Increase Live Preview Size"
          onClick={() =>
            onPreviewScaleChange(Math.min(previewScale + 0.05, 1.1))
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          +
        </button>
        <button
          title="Decrease Live Preview Size"
          onClick={() =>
            onPreviewScaleChange(Math.max(previewScale - 0.05, 0.5))
          }
          style={{
            width: "30px",
            height: "30px",
            border: "none",
            fontSize: "20px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "white",
            color: "black",
            boxShadow: "0 3px 8px rgba(0,0,0,0.3)",
          }}
        >
          –
        </button>
      </div>

      {/* Phone-like preview frame */}
      <div
        style={{
          transform: `scale(${previewScale})`,
          transformOrigin: "center center",
        }}
      >
        <div
          style={{
            width: "270px",
            height: "480px",
            border: "3px solid #222",
            borderRadius: "24px",
            overflow: "hidden",
            background: "#000",
            boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          }}
        >
          <RemotionChatPlayer
            chatdata={chatdata}
            avatars={avatars}
            bgVideo={bgVideo}
            chatAudio={chatAudio}
            musicAudio={musicAudio}
            fontFamily={fontFamily}
            fontSize={fontSize}
            fontColor={fontColor}
            chatTheme={chatTheme}
            timeShiftSec={timeShiftSec}
            duration={duration}
          />
           {showSafeMargins && (
          <div
            style={{
              position: "absolute",
              inset: "5%",
              border: "2px dashed rgba(255,255,255,0.25)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        )}
        </div>
      </div>
    </div>
  );
};
// TypingAnimation.tsx
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import React from "react";

type TypingAnimationProps = {
  content: string;
  backgroundImage: string;
  duration: number;
  fps: number;
  fontSize: number;
  fontColor: string;
  fontFamily: string;
  sound: string;
};

// Helper: split into lines (keeps words intact if possible)
function splitIntoLines(text: string, maxLength = 50): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if ((currentLine + " " + word).trim().length <= maxLength) {
      currentLine = currentLine ? currentLine + " " + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines;
}

export const TypingAnimation: React.FC<TypingAnimationProps> = ({
  content,
  backgroundImage,
  duration,
  fps,
  fontSize,
  fontColor,
  fontFamily,
  sound,
}) => {
  const frame = useCurrentFrame();
  const durationInFrames = duration * fps;

  // Typing should finish earlier: e.g. 85% of duration
  const typingFrames = durationInFrames * 0.85;

  // Progress goes 0 → 1
  const progress = interpolate(frame, [0, typingFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Split content into lines
  const lines = splitIntoLines(content, 50);

  // Total characters across all lines
  const totalChars = lines.reduce((sum, line) => sum + line.length, 0);

  // Characters revealed
  const charactersToShow = Math.floor(progress * totalChars);

  // Smooth entrance scale
  const textEntrance = interpolate(frame, [0, 20], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  let revealedCount = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center", // center horizontally
        alignItems: "center", // center vertically
        padding: "40px",
      }}
    >
      {/* Background typing sound (looped) */}
      {sound && <Audio src={staticFile(sound)} loop />}

      <div
        style={{
          width: "80%",
          lineHeight: 1.5,
          transform: `scale(${textEntrance})`, // entrance animation
          transition: "transform 0.3s ease-out",
        }}
      >
        {lines.map((line, lineIndex) => {
          const startIndex = revealedCount;
          const endIndex = startIndex + line.length;
          const isFullyVisible = charactersToShow >= endIndex;
          const visibleChars = Math.max(
            0,
            Math.min(charactersToShow - startIndex, line.length)
          );

          revealedCount = endIndex;

          return (
            <div
              key={lineIndex}
              style={{
                fontSize,
                color: fontColor,
                fontFamily,
                textAlign: "justify",
                textAlignLast: "center", // last line looks natural
                textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                minHeight: fontSize * 1.4, // reserve fixed vertical space
                marginBottom: fontSize * 0.3,
              }}
            >
              {line.substring(0, visibleChars)}
              {/* Cursor only on the current line */}
              {charactersToShow >= startIndex && !isFullyVisible && (
                <span
                  style={{
                    fontFamily,
                    fontSize,
                    color: fontColor,
                    opacity: frame % 30 < 15 ? 1 : 0,
                  }}
                >
                  |
                </span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

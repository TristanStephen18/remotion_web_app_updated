import React from "react";

export const AvatarSelector: React.FC<{
  avatars: { left: string; right: string };
  setAvatars: React.Dispatch<
    React.SetStateAction<{ left: string; right: string }>
  >;
}> = ({ avatars, setAvatars }) => {
  const colorMap = {
    left: "#0b63ff", // blue
    right: "#ff4fa3", // pink
  };

  const categories = {
    vector: Array.from({ length: 10 }, (_, i) => `/images/vectors/v${i + 1}.jpg`),
    people: Array.from({ length: 10 }, (_, i) => `/images/people/p${i + 1}.jpg`),
    random: Array.from({ length: 10 }, (_, i) => `/images/random/r${i + 1}.jpg`),
  };

  const getRole = (src: string): "left" | "right" | null => {
    if (src === avatars.left) return "left";
    if (src === avatars.right) return "right";
    return null;
  };

  const handleSelect = (src: string) => {
    if (avatars.left === src) {
      setAvatars((prev) => ({ ...prev, left: "" }));
      return;
    }
    if (avatars.right === src) {
      setAvatars((prev) => ({ ...prev, right: "" }));
      return;
    }

    if (!avatars.left) {
      setAvatars((prev) => ({ ...prev, left: src }));
    } else if (!avatars.right) {
      setAvatars((prev) => ({ ...prev, right: src }));
    } else {
      // Replace right if both taken
      setAvatars((prev) => ({ ...prev, right: src }));
    }
  };

  return (
    <div
      style={{
        marginBottom: "1.5rem",
        padding: "1rem",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 6px 18px rgba(12,24,48,0.06)",
        border: "1px solid #eef2ff",
      }}
    >
      <h3 style={{ marginBottom: 16, color: "#0b63ff" }}>🖼️ Avatar Selection</h3>

      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        Choose <strong>two avatars</strong> for your conversation.
        <br />
        <span style={{ color: "#0b63ff", fontWeight: 600 }}>Blue</span> =
        Left&nbsp;Person,&nbsp;
        <span style={{ color: "#ff4fa3", fontWeight: 600 }}>Pink</span> =
        Right&nbsp;Person.
      </p>

      {/* Selected avatars summary */}
      <div
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          background: "#f9f9ff",
          border: "1px solid #e0e7ff",
          borderRadius: 8,
          fontSize: 13,
          color: "#333",
        }}
      >
        <p>
          <strong style={{ color: "#0b63ff" }}>Left:</strong>{" "}
          {avatars.left ? (
            <img
              src={avatars.left}
              alt="left avatar"
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: "50%",
                border: `2px solid ${colorMap.left}`,
              }}
            />
          ) : (
            <span style={{ color: "#888" }}>Not selected</span>
          )}
        </p>
        <p>
          <strong style={{ color: "#ff4fa3" }}>Right:</strong>{" "}
          {avatars.right ? (
            <img
              src={avatars.right}
              alt="right avatar"
              style={{
                width: 40,
                height: 40,
                objectFit: "cover",
                borderRadius: "50%",
                border: `2px solid ${colorMap.right}`,
              }}
            />
          ) : (
            <span style={{ color: "#888" }}>Not selected</span>
          )}
        </p>
      </div>

      {/* Category lists */}
      {Object.entries(categories).map(([cat, images]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <h4
            style={{
              marginBottom: 8,
              fontSize: 14,
              color: "#222",
              textTransform: "capitalize",
            }}
          >
            {cat} Avatars
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
              gap: "10px",
            }}
          >
            {images.map((src) => {
              const role = getRole(src);
              const borderColor = role ? colorMap[role] : "#ddd";

              return (
                <div
                  key={src}
                  onClick={() => handleSelect(src)}
                  style={{
                    position: "relative",
                    border: `2px solid ${borderColor}`,
                    borderRadius: 10,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={src}
                    alt={src}
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  {role && (
                    <span
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: colorMap[role],
                        color: "#fff",
                        fontSize: 10,
                        padding: "2px 6px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
                    >
                      {role === "left" ? "Left" : "Right"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

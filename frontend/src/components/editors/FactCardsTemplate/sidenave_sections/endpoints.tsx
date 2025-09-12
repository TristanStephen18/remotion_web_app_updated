import type React from "react";
import type { Slide } from "../../../layout/EditorPreviews/FacstCardTemplate";

export interface IntroOutroProps {
  intro: Slide;
  outro: Slide;
  setIntro: React.Dispatch<React.SetStateAction<Slide>>;
  setOutro: React.Dispatch<React.SetStateAction<Slide>>;
}

export const IntroOutroPanel: React.FC<IntroOutroProps> = ({
  intro,
  outro,
  setIntro,
  setOutro,
}) => {
  const cardStyle: React.CSSProperties = {
    marginBottom: "1.5rem",
    padding: "1rem",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    border: "1px solid #eee",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: "1rem",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "#fafafa",
    fontSize: 16,
  };

  return (
    <div>
      {/* Intro Card */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Intro</h3>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>Title</div>
          <input
            type="text"
            value={intro.title}
            onChange={(e) =>
              setIntro((prev) => ({ ...prev, title: e.target.value }))
            }
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
            Subtitle
          </div>
          <textarea
            value={intro.subtitle}
            onChange={(e) =>
              setIntro((prev) => ({ ...prev, subtitle: e.target.value }))
            }
            style={inputStyle}
          />
        </label>
      </div>

      {/* Outro Card */}
      <div style={cardStyle}>
        <h3 style={{ marginBottom: "0.75rem", color: "#0077ff" }}>Outro</h3>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>Title</div>
          <input
            type="text"
            value={outro.title}
            onChange={(e) =>
              setOutro((prev) => ({ ...prev, title: e.target.value }))
            }
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          <div style={{ marginBottom: "0.3rem", color: "#ff4fa3" }}>
            Subtitle
          </div>
          <textarea
            value={outro.subtitle}
            onChange={(e) =>
              setOutro((prev) => ({ ...prev, subtitle: e.target.value }))
            }
            style={inputStyle}
          />
        </label>
      </div>
    </div>
  );
};

import type React from "react";

interface DisplayerModalProps {
  exportUrl: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DisplayerModal: React.FC<DisplayerModalProps> = ({
  exportUrl,
  setShowModal,
}) => {
  // infer extension from URL (backend serves already converted files like .mp4, .gif, .webm)
  const fileExtension = exportUrl.split(".").pop()?.toLowerCase();

  const renderPreview = () => {
    if (fileExtension === "gif") {
      return (
        <img
          src={exportUrl}
          alt="Generated GIF preview"
          style={{
            width: "100%",
            maxHeight: "50vh",
            borderRadius: "8px",
            marginBottom: "1rem",
            objectFit: "contain",
            background: "#000",
          }}
        />
      );
    }
    return (
      <video
        src={exportUrl}
        controls
        style={{
          width: "100%",
          maxHeight: "50vh",
          borderRadius: "8px",
          marginBottom: "1rem",
          background: "#000",
          objectFit: "contain",
        }}
      />
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "1.5rem",
          borderRadius: "12px",
          width: "380px", // 🔹 slightly smaller
          maxWidth: "95%",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <h2
          style={{
            marginBottom: "1rem",
            color: "#0077ff",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          🎉 Your Export is Ready!
        </h2>

        {/* Preview block */}
        {renderPreview()}

        {/* Download & Close buttons */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={exportUrl}
            download={`quote-video.${fileExtension || "mp4"}`}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              background: "linear-gradient(90deg,#ff4fa3,#8a4dff,#0077ff)",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
              fontSize: "0.9rem",
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            }}
          >
            ⬇️ Download {fileExtension?.toUpperCase() || "MP4"}
          </a>
          <button
            onClick={() => setShowModal(false)}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "8px",
              border: "none",
              background: "#ccc",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ✖ Close
          </button>
        </div>
      </div>
    </div>
  );
};

export const LoadingOverlay: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(243, 242, 235, 0.66)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      {/* Inner Box */}
      <div
        style={{
          background: "#fff",
          padding: "2rem 3rem",
          borderRadius: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          minWidth: "280px",
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "6px solid rgba(255,255,255,0.2)",
            borderTop: "6px solid blue",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "1rem",
          }}
        />

        {/* Message */}
        <p
          style={{
            color: "blue",
            fontSize: "1.1rem",
            textAlign: "center",
            margin: 0,
            fontFamily: "sans-serif",
          }}
        >
          {message}
        </p>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

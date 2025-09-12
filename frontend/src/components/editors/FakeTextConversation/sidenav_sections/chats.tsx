import React from "react";

type ChatLine = { speaker: "person_1" | "person_2"; text: string };

export const MessagesPanel: React.FC<{
  chats: ChatLine[];
  setChats: React.Dispatch<React.SetStateAction<ChatLine[]>>;
}> = ({ chats, setChats }) => {
  const handleChange = (
    index: number,
    field: keyof ChatLine,
    value: string
  ) => {
    const updated = [...chats];
    updated[index] = { ...updated[index], [field]: value };
    setChats(updated);
  };

  const handleAdd = () => {
    setChats([...chats, { speaker: "person_1", text: "" }]);
  };

  const handleDelete = (index: number) => {
    setChats(chats.filter((_, i) => i !== index));
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
      <h3 style={{ marginBottom: 16, color: "#0b63ff" }}>💬 Conversation Messages</h3>

      <p style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>
        Manage the chat lines between <strong>Person 1</strong> and{" "}
        <strong>Person 2</strong>.  
        You decide the order of the conversation by choosing the speaker for
        each line.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {chats.map((chat, index) => (
          <div
            key={index}
            style={{
              padding: "12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "#fafafa",
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* Speaker selector */}
            <label
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: 13,
                marginBottom: 6,
                color: "#333",
              }}
            >
              Speaker
            </label>
            <select
              value={chat.speaker}
              onChange={(e) =>
                handleChange(index, "speaker", e.target.value as "person_1" | "person_2")
              }
              style={{
                marginBottom: 8,
                padding: "6px 8px",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 13,
                width: "100%",
              }}
            >
              <option value="person_1">Person 1</option>
              <option value="person_2">Person 2</option>
            </select>

            {/* Message text */}
            <label
              style={{
                display: "block",
                fontWeight: 600,
                fontSize: 13,
                marginBottom: 6,
                color: "#333",
              }}
            >
              Message
            </label>
            <textarea
              value={chat.text}
              onChange={(e) => handleChange(index, "text", e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: 6,
                fontSize: 13,
                resize: "vertical",
                marginBottom: 8,
              }}
            />

            {/* Delete button */}
            <button
              onClick={() => handleDelete(index)}
              style={{
                background: "#ff4fa3",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: 6,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              🗑️ Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={handleAdd}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "10px",
          background: "#0b63ff",
          color: "#fff",
          fontWeight: 600,
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        ➕ Add Message
      </button>
    </div>
  );
};

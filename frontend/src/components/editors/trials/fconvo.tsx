import React, { useState } from "react";

type ChatLine = { speaker: "person_1" | "person_2"; text: string };

export const Fakeconvo: React.FC = () => {
  const [voice1, setVoice1] = useState("");
  const [voice2, setVoice2] = useState("");
  const [chats, setChats] = useState<ChatLine[]>([
    { speaker: "person_1", text: "Hey, have you tried The Green Fork yet?" },
    { speaker: "person_2", text: "Not yet. Is it any good?" },
  ]);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async () => {
    const payload = {
      voices: [voice1, voice2],
      chats,
    };

    const res = await fetch("http://localhost:3000/sound/test-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Fake Conversation Generator 🎙️</h1>

      {/* Voice inputs */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Voice 1 ID:</label>
        <input
          type="text"
          value={voice1}
          onChange={(e) => setVoice1(e.target.value)}
          placeholder="Enter ElevenLabs Voice ID"
          style={{ marginLeft: "1rem", width: "300px" }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label>Voice 2 ID:</label>
        <input
          type="text"
          value={voice2}
          onChange={(e) => setVoice2(e.target.value)}
          placeholder="Enter ElevenLabs Voice ID"
          style={{ marginLeft: "1rem", width: "300px" }}
        />
      </div>

      {/* Chat inputs */}
      {chats.map((chat, idx) => (
        <div key={idx} style={{ marginBottom: "1rem" }}>
          <label>{chat.speaker}:</label>
          <input
            type="text"
            value={chat.text}
            onChange={(e) => {
              const newChats = [...chats];
              newChats[idx].text = e.target.value;
              setChats(newChats);
            }}
            style={{ marginLeft: "1rem", width: "500px" }}
          />
        </div>
      ))}

      <button
        onClick={() =>
          setChats([...chats, { speaker: chats.length % 2 === 0 ? "person_1" : "person_2", text: "" }])
        }
        style={{
          marginBottom: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      >
        ➕ Add Message
      </button>

      <br />

      <button
        onClick={handleSubmit}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#4cafef",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Generate Conversation
      </button>

      {response && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Response JSON</h2>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "1rem",
              borderRadius: "8px",
              maxHeight: "400px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(response, null, 2)}
          </pre>

          {response.audio_file && (
            <div style={{ marginTop: "1rem" }}>
              <h3>Generated Audio</h3>
              <audio
                controls
                src={`http://localhost:3000/fakeconvo/fakeconvo.mp3`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

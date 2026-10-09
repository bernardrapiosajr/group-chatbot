import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!text.trim()) return;

    const next = [
      ...messages,
      { role: "user", content: text }
    ];

    setMessages(next);
    setText("");
    setBusy(true);

    try {
      const r = await fetch(
        `${import.meta.env.VITE_API_URL}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: next
          })
        }
      );

      const data = await r.json();

      if (!r.ok) {
        throw new Error(data.error || "Server error");
      }

      const { reply } = data;

      setMessages([
        ...next,
        { role: "assistant", content: reply }
      ]);
    } catch (error) {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Error: " + error.message
        }
      ]);
    }

    setBusy(false);
  }

  return (
    <div style={{
      maxWidth: "700px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial"
    }}>
      <h1>BSIT AI Chatbot</h1>

      <div style={{
        minHeight: "400px",
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px"
      }}>
        {messages.map((message, index) => (
          <div key={index} style={{
            marginBottom: "10px",
            padding: "10px",
            background: message.role === "user"
              ? "#e3f2fd"
              : "#f1f1f1",
            borderRadius: "8px"
          }}>
            <strong>
              {message.role === "user" ? "You" : "AI"}:
            </strong>{" "}
            {message.content}
          </div>
        ))}

        {busy && <p>Typing...</p>}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "12px"
          }}
        />

        <button
          onClick={send}
          disabled={busy}
          style={{
            padding: "12px 20px"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

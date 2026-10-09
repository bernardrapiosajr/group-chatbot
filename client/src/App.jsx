import React, { useState, useRef, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hello! I am your BSIT AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://group-chatbot-icqb.onrender.com/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.reply || data.response || "No response received." }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: `Error: ${data.error || "Server issue occurred."}` }
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Failed to connect to server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerStatus}></div>
        <div>
          <h1 style={styles.title}>BSIT AI Chatbot</h1>
          <p style={styles.subtitle}>Always online to assist you</p>
        </div>
      </header>

      {/* Chat Messages */}
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageRow,
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.bubble,
                ...(msg.sender === "user" ? styles.userBubble : styles.aiBubble),
              }}
            >
              <span style={styles.senderLabel}>
                {msg.sender === "user" ? "YOU" : "AI"}
              </span>
              <p style={styles.messageText}>{msg.text}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.messageRow, justifyContent: "flex-start" }}>
            <div style={{ ...styles.bubble, ...styles.aiBubble, ...styles.loadingBubble }}>
              <span style={styles.senderLabel}>AI</span>
              <p style={styles.messageText}>Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={sendMessage} style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.sendButton}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#0f172a",
    color: "#f8fafc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px",
    backgroundColor: "#1e293b",
    borderBottom: "1px solid #334155",
  },
  headerStatus: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: "600",
    margin: 0,
  },
  subtitle: {
    fontSize: "0.8rem",
    color: "#94a3b8",
    margin: 0,
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageRow: {
    display: "flex",
    width: "100%",
  },
  bubble: {
    maxWidth: "70%",
    padding: "12px 16px",
    borderRadius: "16px",
    wordBreak: "break-word",
  },
  userBubble: {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    borderBottomRightRadius: "4px",
  },
  aiBubble: {
    backgroundColor: "#1e293b",
    color: "#e2e8f0",
    border: "1px solid #334155",
    borderBottomLeftRadius: "4px",
  },
  loadingBubble: {
    opacity: 0.7,
    fontStyle: "italic",
  },
  senderLabel: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: "bold",
    marginBottom: "4px",
    opacity: 0.8,
  },
  messageText: {
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: "1.4",
  },
  inputContainer: {
    display: "flex",
    padding: "16px",
    backgroundColor: "#1e293b",
    borderTop: "1px solid #334155",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    fontSize: "0.95rem",
    outline: "none",
  },
  sendButton: {
    padding: "12px 24px",
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default App;

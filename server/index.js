const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: "API Key is missing in Render Environment Variables." 
      });
    }

    // Tawag sa OpenRouter API gamit ang Gemini model
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash",
        "messages": [
          { "role": "user", "content": message }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || "Error connecting to OpenRouter." 
      });
    }

    const responseText = data.choices[0]?.message?.content || "No response received.";
    return res.json({ reply: responseText });

  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to generate AI response." 
    });
  }
};

app.post("/api/chat", handleChat);
app.post("/chat", handleChat);

app.get("/", (req, res) => {
  res.send("BSIT Chatbot Backend Server is active.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is missing on Render Environment Variables." });
    }

    // Try gemini-1.5-flash first
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const text = result.response.text();

    return res.json({ reply: text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
};

app.post("/api/chat", handleChat);
app.post("/chat", handleChat);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Enable CORS for all origins (fixes Vercel blocking issue)
app.use(cors());
app.use(express.json());

// Initialize Gemini API with your Render Environment Variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Handles both /api/chat AND /chat to avoid 404 route mismatch errors
const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message content is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing on Render." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const responseText = result.response.text();

    return res.json({ reply: responseText });
  } catch (error) {
    console.error("Chatbot Server Error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate AI response." });
  }
};

app.post("/api/chat", handleChat);
app.post("/chat", handleChat);

// Health check endpoint
app.get("/", (req, res) => {
  res.send("BSIT Chatbot Backend Server is active.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

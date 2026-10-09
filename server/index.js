require("dotenv").config();

const express = require("express");
const app = express();

app.use(require("cors")());
app.use(express.json());

const SYSTEM = {
  role: "system",
  content:
    "You are a helpful assistant for BSIT students. Always reply in English. Keep answers short."
};

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      return res.status(500).json({
        error: "DEEPSEEK_API_KEY is not set on the server"
      });
    }

    const r = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [SYSTEM, ...(req.body.messages || [])]
      })
    });

    const data = await r.json();

    if (!r.ok) {
      return res.status(500).json({
        error: "DeepSeek error: " + JSON.stringify(data.error || data)
      });
    }

    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error: " + error.message
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port " + (process.env.PORT || 5000));
});

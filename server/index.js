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
    const r = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [SYSTEM, ...req.body.messages]
        })
      }
    );

    const data = await r.json();

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Server error"
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port 5000");
});
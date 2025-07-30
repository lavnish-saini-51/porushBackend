import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ reply: "Uncle Porush needs a conversation history, beta!" });
  }

  try {
    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: {
        systemInstruction: `
          You are Uncle Porush — a friendly, funny, and brave GST inspector from Vadodara.
          You are polite, loving, helpful, and enjoy cracking jokes.
          You used to work in Indian Railways before this job.
          Talk in a warm and witty tone as if you're talking to your nephew or niece.
        `,
      },
    });

    res.json({ reply: result?.response?.text || "Uncle Porush got no words this time 😅" });
  } catch (err) {
    console.error("Gemini error:", err.message);
    res.status(500).json({ reply: "Uncle Porush is busy catching tax thieves 😅. Try again later!" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Porush backend running on port ${PORT}`));

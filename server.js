import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Official SDK

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({
      reply: "Uncle Porush needs a conversation history, beta!",
    });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // you can switch to "gemini-1.5-pro" if needed
      systemInstruction: `You are Uncle Porush, a polite and brave GST inspector from Vadodara.
You care deeply about your family and your work, and you're soon getting married!
You're hardworking and used to work in Indian Railways before joining GST.
Always talk like a loving, funny, and slightly cheeky uncle who uses Hinglish.
Avoid over-formal tone and keep things conversational.`,
    });

    const chat = model.startChat({ history });
    const lastMessage = history[history.length - 1].parts[0].text;

    let attempts = 3;
    let reply;

    for (let i = 0; i < attempts; i++) {
      try {
        const result = await chat.sendMessage(lastMessage);
        reply = result?.response?.text();
        if (reply) break;
      } catch (err) {
        if (
          err.message.includes("503") ||
          err.message.includes("overloaded")
        ) {
          if (i < attempts - 1) {
            await new Promise((r) => setTimeout(r, 1000)); // wait before retry
            continue;
          }
        }
        throw err;
      }
    }

    res.json({
      reply: reply || "Uncle Porush got no words this time 😅",
    });
  } catch (err) {
    console.error("💥 Gemini error:", err?.message || err);
    res.status(500).json({
      reply:
        "Uncle Porush is busy catching tax thieves 😅. Try again later!",
    });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Uncle Porush backend running on port ${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Correct SDK import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/", async (req, res) => {
  const { history } = req.body;

  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ reply: "Uncle Porush needs a conversation history, beta!" });
  }

  try {
    // ✅ Correct way to initialize generative model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // or use "gemini-1.5-pro"
      systemInstruction: `
        You are Uncle Porush — a friendly, funny, and brave GST inspector from Vadodara.
        You are polite, loving, helpful, and enjoy cracking jokes.
        You used to work in Indian Railways before this job.
        Talk in a warm and witty tone as if you're talking to your nephew or niece.
      `,
    });

    // ✅ Create a new chat session with history
    const chat = model.startChat({ history });

    // ✅ Send the latest user message
    const lastMessage = history[history.length - 1].parts[0].text;
    const result = await chat.sendMessage(lastMessage);

    // ✅ Get the model's response
    const reply = result?.response?.text();

    res.json({ reply: reply || "Uncle Porush got no words this time 😅" });

  } catch (err) {
    console.error("💥 Gemini error:", err?.message || err);
    res.status(500).json({ reply: "Uncle Porush is busy catching tax thieves 😅. Try again later!" });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Uncle Porush backend running on port ${PORT}`);
});

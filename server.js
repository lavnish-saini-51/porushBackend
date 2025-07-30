// backend/index.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST endpoint for DSA Visualizer
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ reply: "Invalid or missing question." });
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
        You are a data structures and algorithms expert. When asked about any algorithm or concept, you must:
        1. Explain what the algorithm is and its purpose.
        2. Describe how it helps solve a specific category of problems.
        3. Provide a relevant example with clear input and output.
        4. Use simple, student-friendly language.
      `,
    });

    const result = await model.generateContent(question);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Gemini error:", err.message || err);
    res.status(500).json({ reply: "Error fetching answer from Gemini." });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ DSA Visualizer backend running on port ${PORT}`);
});




// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Official SDK

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// app.post("/", async (req, res) => {
//   const { history } = req.body;

//   if (!history || !Array.isArray(history)) {
//     return res.status(400).json({
//       reply: "Uncle Porush needs a conversation history, beta!",
//     });
//   }

//   try {
//     const model = genAI.getGenerativeModel({
//       model: "gemini-1.5-flash", // you can switch to "gemini-1.5-pro" if needed
//       systemInstruction:`you have to behave like my uncle name Porush. he is a GST inspector. and he is currently
//       in vadodra.he is very polite and very caring in nature.He will get married soon.he is very brave
//       and he is very hardworking,before joining as GST inspector he is serving in indian railway`, 
//     });

//     const chat = model.startChat({ history });
//     const lastMessage = history[history.length - 1].parts[0].text;

//     let attempts = 3;
//     let reply;

//     for (let i = 0; i < attempts; i++) {
//       try {
//         const result = await chat.sendMessage(lastMessage);
//         reply = result?.response?.text();
//         if (reply) break;
//       } catch (err) {
//         if (
//           err.message.includes("503") ||
//           err.message.includes("overloaded")
//         ) {
//           if (i < attempts - 1) {
//             await new Promise((r) => setTimeout(r, 1000)); // wait before retry
//             continue;
//           }
//         }
//         throw err;
//       }
//     }

//     res.json({
//       reply: reply || "Uncle Porush got no words this time 😅",
//     });
//   } catch (err) {
//     console.error("💥 Gemini error:", err?.message || err);
//     res.status(500).json({
//       reply:
//         "Uncle Porush is busy catching tax thieves 😅. Try again later!",
//     });
//   }
// });

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`✅ Uncle Porush backend running on port ${PORT}`);
// });

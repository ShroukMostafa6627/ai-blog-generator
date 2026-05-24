import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CohereClient } from "cohere-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  const { topic, tone, length } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  if (!process.env.COHERE_API_KEY) {
    return res.json({
      blog: `Title: ${topic}\n\nIntroduction:\n${topic} is an important topic that is becoming more popular in the modern world.\n\nBody:\nThis ${length.toLowerCase()} blog post is written in a ${tone.toLowerCase()} tone. It explains the main idea clearly and gives readers useful information.\n\nKey Points:\n1. ${topic} helps people understand new ideas.\n2. It can improve productivity and creativity.\n3. It is useful for students, professionals, and businesses.\n\nConclusion:\nIn conclusion, ${topic} is a valuable subject with many benefits and future possibilities.`,
    });
  }

  try {
    const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });

    const response = await cohere.generate({
      model: "command",
      prompt: `Write a ${length} blog post about "${topic}" in a ${tone} tone. Include a title, introduction, body, key points, and conclusion.`,
      maxTokens: length === "Short" ? 300 : length === "Medium" ? 600 : 900,
      temperature: 0.7,
    });

    res.json({ blog: response.generations[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: "AI generation failed" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

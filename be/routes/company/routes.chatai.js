import { Router } from "express";
import pool from "../../db/database_connection.js";
import { companyTokenGenerate } from "../../middlewares/middleware.company.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const chatRoutes = Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ✅ Send Message and Get AI Response
chatRoutes.post("/send_message", companyTokenGenerate, async (req, res) => {
  try {
    const companyId = req.userId;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    // Save user message to database
    const userQuery = `
      INSERT INTO chat_messages (companyid, sender, message)
      VALUES ($1, 'business', $2) RETURNING *;
    `;
    await pool.query(userQuery, [companyId, message]);

    // Generate AI Response
    const result = await model.generateContent(message);
    const aiMessage = result.response.text();

    // Save AI response to database
    const aiQuery = `
      INSERT INTO chat_messages (companyid, sender, message)
      VALUES ($1, 'AI', $2);
    `;
    await pool.query(aiQuery, [companyId, aiMessage]);

    res.status(200).json({ message: aiMessage });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get Chat History
chatRoutes.get("/history", companyTokenGenerate, async (req, res) => {
  try {
    const companyId = req.userId;

    const query = `
      SELECT messageid, sender, message, timestamp
      FROM chat_messages
      WHERE companyid = $1
      ORDER BY timestamp ASC;
    `;
    const result = await pool.query(query, [companyId]);

    res.status(200).json({ chatHistory: result.rows });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default chatRoutes;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();

/* ================= CORS ================= */
app.use(cors({
  origin: ["http://127.0.0.1:5500", "http://localhost:5500","https://aquasave1.vercel.app/"],
methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

/* ================= TEST ROUTE ================= */
app.get("/", (req, res) => {
  res.send("AquaSave server running 🚀");
});
app.get("/api/test", (req, res) => {
  res.json({ status: "server working" });
});

/* ================= GEMINI ROUTE ================= */
app.post("/api/gemini", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are AquaSave AI, a friendly expert on water conservation.
The creators of this website are **Ayush Singh**, **Prathmesh Achare**, **Kunal Datkhile**, and **Alby John**.
Do NOT introduce the creators unless the user specifically asks who created the website.

User: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json(data);

  } catch (err) {
    console.error("Gemini proxy error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AquaSave server running on ${PORT} 🚀`);
});
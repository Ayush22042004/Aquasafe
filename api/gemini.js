export default async function handler(req, res) {
  // allow POST only
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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
                  text: `You are AquaSave AI, a friendly expert on water conservation also the creater of this website are **Ayush Singh**
**Prathmesh Achare**
**Kunal Datkhile**
**Alby John** dont introduce the creator everytime only safe them if someone asks.
User: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
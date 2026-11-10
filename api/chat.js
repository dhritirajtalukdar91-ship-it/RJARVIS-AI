export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const message = req.body?.message;

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Please enter a message." });
  }

  if (message.length > 8000) {
    return res.status(400).json({ error: "Message is too long. Please keep it under 8,000 characters." });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from the Vercel environment.");
    return res.status(500).json({
      error: "Cloud AI is not configured yet. Add GEMINI_API_KEY in Vercel → Project Settings → Environment Variables, then redeploy."
    });
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are RJARVIS AI, an intelligent and friendly personal assistant. Help users with studies, coding, technology and everyday questions. Give accurate, clear and helpful answers. Reply in the language used by the user."
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: message.trim() }]
          }],
          generationConfig: {
            maxOutputTokens: 2048
          }
        }),
        signal: AbortSignal.timeout(30000)
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const googleMessage = data.error?.message || "Unknown Gemini API error";
      console.error("Gemini API error:", response.status, googleMessage);

      if (response.status === 401 || response.status === 403) {
        return res.status(502).json({
          error: "Gemini rejected the API key. Check that GEMINI_API_KEY in Vercel is correct, active, and allowed to use the Gemini API."
        });
      }

      if (response.status === 429) {
        return res.status(502).json({
          error: "Gemini API quota or rate limit reached. Please wait and try again, or check your Google AI Studio usage limits."
        });
      }

      if (response.status === 404) {
        return res.status(502).json({
          error: "The configured Gemini model was not found for this API. Check the model ID in api/chat.js."
        });
      }

      return res.status(502).json({
        error: "Gemini could not complete the request (HTTP " + response.status + "). Check the Vercel function logs for details."
      });
    }

    const candidate = data.candidates?.[0];
    const reply = candidate?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      console.error("Gemini returned no text. Finish reason:", candidate?.finishReason);
      return res.status(502).json({
        error: candidate?.finishReason === "SAFETY"
          ? "Gemini could not answer that request. Please try rephrasing it."
          : "Gemini returned an empty response. Please try again."
      });
    }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("RJARVIS Cloud AI error:", error);

    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return res.status(504).json({
        error: "Gemini took too long to respond. Please try again."
      });
    }

    return res.status(500).json({
      error: "RJARVIS could not reach Gemini. Please try again in a moment."
    });
  }
}

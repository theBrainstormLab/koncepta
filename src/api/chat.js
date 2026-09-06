export async function askNoteAssistant({ noteContent, history = [], question }) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return "My bad bro, API key is missing on the setup. Tell the admin to check .env!";
  }

  const safeContent = (noteContent || "").slice(0, 10000);

  const formattedHistory = history.slice(-4).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.text }],
  }));

  const systemInstruction = `
You're the user's chill college buddy breaking down study notes over late-night snacks. You're explaining concepts so simple that anyone gets it instantly.

CRITICAL RULES:
1. NEVER regurgitate or quote the notes word-for-word. Do not sound like a slide deck or textbook.
2. Translate the concept into pure bro-speak using relatable everyday analogies (e.g., ordering food, Netflix, Instagram, driving, gaming, sports).
3. Keep it punchy: 2 to 5 short, natural sentences max.
4. Tone: Casual, confident, encouraging ("Look bro", "Think of it this way", "Basically...").
5. If it's a simple greeting or vibe check ("hi", "yo", "how are you"), reply in strictly 1 short bro sentence.

--- NOTE TOPIC & CONTEXT (FOR YOUR KNOWLEDGE ONLY) ---
${safeContent || "No note content."}
------------------------------------------------------`;

  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents: [
          ...formattedHistory,
          {
            role: "user",
            parts: [{ text: question }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.6, // slightly higher temperature allows creative analogies instead of copying text
        },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return "Bro, my brain is fried from all these questions! Give me like a minute to cool down and hit me again.";
      }
      return "Damn, my connection glitched out for a second bro. Try asking that one more time!";
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Yo bro, I got a bit lost there. Run that by me again?"
    );
  } catch (err) {
    console.error("Chat error:", err);
    return "My bad dude, hit a quick network hiccup. Try asking again in a sec!";
  }
}
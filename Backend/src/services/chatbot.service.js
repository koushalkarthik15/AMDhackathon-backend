const axios = require("axios");

function extractJSON(text) {
  try {
    // Try direct parse first
    return JSON.parse(text);
  } catch {
    // Extract first JSON block manually
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      const jsonString = text.substring(start, end + 1);
      return JSON.parse(jsonString);
    }
    throw new Error("No valid JSON found in Gemini response");
  }
}

async function generateChatResponse(message, constraints) {
  try {
    const prompt = `
You must return ONLY valid JSON.
Do not use markdown.
Do not include explanations.
Do not include extra text.

Return format:
{
  "reply": "string",
  "suggestedFollowUps": ["string"]
}

User message: "${message}"
Known constraints: ${JSON.stringify(constraints)}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024
        }
      }
    );

    const rawText = response.data.candidates[0].content.parts[0].text;
    console.log("RAW GEMINI RESPONSE:\n", rawText);

    const parsed = extractJSON(rawText);

    // Validate structure
    if (
      typeof parsed.reply !== "string" ||
      !Array.isArray(parsed.suggestedFollowUps)
    ) {
      throw new Error("Invalid JSON structure from Gemini");
    }

    return parsed;

  } catch (error) {
    console.error("GEMINI ERROR:", error.response?.data || error.message);

    return {
      reply: "Got it. Let’s continue refining your plan.",
      suggestedFollowUps: []
    };
  }
}

module.exports = { generateChatResponse };
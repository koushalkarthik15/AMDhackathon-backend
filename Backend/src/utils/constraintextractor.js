function extractConstraints(message) {
  const lower = message.toLowerCase();
  const extracted = {};

  // ------------------ TIME ------------------
  const hourMatch = lower.match(/(\d+)\s*(hours|hrs|hour)/);
  const minuteMatch = lower.match(/(\d+)\s*(minutes|mins|min)/);

  if (hourMatch) {
    extracted.timeMinutes = parseInt(hourMatch[1]) * 60;
  } else if (minuteMatch) {
    extracted.timeMinutes = parseInt(minuteMatch[1]);
  }

  // ------------------ BUDGET ------------------
  const budgetMatch = lower.match(/₹?\s?(\d{2,5})/);
  if (budgetMatch) {
    const amount = parseInt(budgetMatch[1]);
    if (amount >= 50) extracted.budget = amount;
  }

  // ------------------ MOOD ------------------
  const moods = ["quiet", "relaxed", "social", "productive"];
  for (const mood of moods) {
    if (lower.includes(mood)) {
      extracted.mood = mood;
      break;
    }
  }

  // ------------------ DISTANCE ------------------
  if (lower.includes("near") || lower.includes("close")) {
    extracted.distance = "near";
  } else if (lower.includes("far")) {
    extracted.distance = "far";
  }

  // ------------------ CATEGORY ------------------
  if (
    lower.includes("eat") ||
    lower.includes("cafe") ||
    lower.includes("food") ||
    lower.includes("restaurant")
  ) {
    extracted.category = "food";
  } else if (
    lower.includes("walk") ||
    lower.includes("park") ||
    lower.includes("outdoor")
  ) {
    extracted.category = "outdoor";
  } else if (
    lower.includes("study") ||
    lower.includes("library") ||
    lower.includes("focus")
  ) {
    extracted.category = "study";
  } else if (
    lower.includes("hangout") ||
    lower.includes("friends") ||
    lower.includes("meetup")
  ) {
    extracted.category = "social";
  } else if (
    lower.includes("movie") ||
    lower.includes("game") ||
    lower.includes("fun")
  ) {
    extracted.category = "entertainment";
  }

  // ------------------ GENERIC KEYWORDS (SCALABLE) ------------------
  const stopWords = [
    "i",
    "have",
    "want",
    "plan",
    "change",
    "create",
    "new",
    "to",
    "for",
    "the",
    "and",
    "it",
    "should",
    "be",
    "hours",
    "hour",
    "mins",
    "minutes",
    "near",
    "close",
    "far"
  ];

  const words = lower.split(/\s+/);

  const keywords = words.filter(
    (w) =>
      w.length > 3 &&
      !stopWords.includes(w) &&
      !["food", "outdoor", "study", "social", "entertainment"].includes(w)
  );

  if (keywords.length > 0) {
    extracted.keywords = keywords;
  }

  return extracted;
}

module.exports = { extractConstraints };
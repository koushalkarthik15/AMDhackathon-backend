const activities = require("./activityDataset");

function scoreActivity(activity, constraints, remainingTime) {
  const { budget, mood, distance, category, keywords } = constraints;

  let score = 0;

  // Budget Fit
  if (budget) {
    const budgetFit = 1 - activity.cost / budget;
    score += 0.35 * Math.max(budgetFit, 0);
  }

  // Duration Fit
  if (remainingTime) {
    const durationFit =
      1 - Math.abs(activity.duration - remainingTime) / remainingTime;
    score += 0.25 * Math.max(durationFit, 0);
  }

  // Mood Fit
  if (mood && activity.moodTags?.includes(mood)) {
    score += 0.2;
  }

  // Distance Fit
  if (distance && activity.distance === distance) {
    score += 0.1;
  }

  // Category Boost
  if (category && activity.category === category) {
    score += 0.1;
  }

  // 🔥 Keyword Boost (Smart + Scalable)
  if (keywords && keywords.length > 0) {
    const match = keywords.some((keyword) =>
      activity.name.toLowerCase().includes(keyword)
    );
    if (match) {
      score += 0.3; // strong preference boost
    }
  }

  return score;
}

function generatePlan(constraints, previousPlan = null) {
  let filtered = activities;

  const remainingTime = constraints.timeMinutes || 60;

  // ---- Hard Filters ----

  if (constraints.budget) {
    filtered = filtered.filter(
      (a) => a.cost <= constraints.budget
    );
  }

  if (constraints.category) {
    filtered = filtered.filter(
      (a) => a.category === constraints.category
    );
  }

  if (constraints.distance) {
    filtered = filtered.filter(
      (a) => a.distance === constraints.distance
    );
  }

  if (constraints.mood) {
    filtered = filtered.filter(
      (a) => a.moodTags?.includes(constraints.mood)
    );
  }

  // ---- Avoid Same Plan on Regenerate ----
  if (previousPlan && previousPlan.activities) {
    const previousNames = previousPlan.activities.map(
      (a) => a.name
    );

    const alternative = filtered.filter(
      (a) => !previousNames.includes(a.name)
    );

    if (alternative.length > 0) {
      filtered = alternative;
    }
  }

  if (filtered.length === 0) {
    return {
      status: "draft",
      activities: [],
      reasoning: ["No matching activities found."]
    };
  }

  // ---- Scoring & Ranking ----
  const scored = filtered.map((activity) => ({
    activity,
    score: scoreActivity(activity, constraints, remainingTime)
  }));

  scored.sort((a, b) => b.score - a.score);

  const selected = scored[0].activity;

  return {
    status: "optimized",
    estimatedCost:totalCost,
    totalDuration,
    activities: [selected],
    reasoning: [
      "Selected based on budget fit, duration fit, and preference match.",
      `Leaves approximately ${remainingTime} minutes buffer`
    ]
  };
}

module.exports = { generatePlan };
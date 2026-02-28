const sessionService = require("../services/session.service");
const { extractConstraints } = require("../utils/constraintextractor");
const { evaluateConfidence } = require("../utils/confidenceevaluator");
const { generatePlan } = require("../utils/planningengine");
const { generateChatResponse } = require("../services/chatbot.service");

exports.handleChat = async (req, res) => {
  const { sessionId, message } = req.body || {};

  if (!sessionId || !message) {
    return res.status(400).json({ error: "Invalid request" });
  }

  let session = sessionService.get(sessionId);
  if (!session) {
    session = sessionService.create(sessionId);
  }

  const lower = message.toLowerCase();

  // ---- Detect explicit regeneration commands (B) ----
  const forceRegenerate =
    lower.includes("new plan") ||
    lower.includes("change plan") ||
    lower.includes("create plan") ||
    lower.includes("another plan") ||
    lower.includes("different plan");

  // ---- Extract constraints safely ----
  const extracted = extractConstraints(message);

  let preferenceChanged = false;

  for (const key in extracted) {
  if (
    extracted[key] !== undefined &&
    extracted[key] !== null &&
    JSON.stringify(extracted[key]) !==
      JSON.stringify(session.constraints[key])
  ) {
    session.constraints[key] = extracted[key];
    preferenceChanged = true;
  }
}

  session.confidence = evaluateConfidence(session.constraints);

  // ---- Call Gemini (conversation layer) ----
  const bot = await generateChatResponse(message, session.constraints);

  let plan = session.currentPlan || {
    status: "draft",
    summary: "Refining your preferences..."
  };

  let suggestions = [];

  // ---- Decide regeneration ----
  const shouldGeneratePlan =
    session.confidence >= 0.8 &&
    (preferenceChanged || forceRegenerate || !session.currentPlan);

  if (shouldGeneratePlan) {
    const logicalPlan = generatePlan(session.constraints);

    if (logicalPlan.activities.length > 0) {
      const { buildSchedule } = require("../utils/scheduleBuilder");

      const scheduled = buildSchedule(
        logicalPlan.activities,
        session.constraints
      );

      plan = {
        status: logicalPlan.status,
        timeWindow: scheduled.timeWindow,
        estimatedCost: scheduled.totalCost,
        totalDistanceKm: scheduled.totalDistanceKm,
        activities: scheduled.schedule,
        reasoning: logicalPlan.reasoning,
        accessibility: {
          wheelchairAccessible: true
        }
      };
    } else {
      plan = logicalPlan;
    }

    session.currentPlan = plan;
  } else {
    // If confidence low → suggest missing info
    if (session.confidence < 0.8) {
      if (!session.constraints.timeMinutes)
        suggestions.push("How much time do you have?");
      if (!session.constraints.budget)
        suggestions.push("What is your budget?");
      if (!session.constraints.mood)
        suggestions.push("What mood are you in?");
      if (!session.constraints.distance)
        suggestions.push("Should it be nearby?");
    }
  }

  sessionService.save(session);

  res.json({
    chatReply: bot.reply,
    suggestions:
      suggestions.length > 0 ? suggestions : bot.suggestedFollowUps,
    plan
  });
};
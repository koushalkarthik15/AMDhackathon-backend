const sessionService = require("../services/session.service");
const { generatePlan } = require("../utils/planningengine");
const { evaluateConfidence } = require("../utils/confidenceevaluator");

exports.handleRefine = (req, res) => {
  const { sessionId, action } = req.body || {};

  if (!sessionId || !action) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const session = sessionService.get(sessionId);

  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  // Modify constraints deterministically
  switch (action) {
    case "cheaper":
      if (session.constraints.budget) {
        session.constraints.budget = Math.max(
          Math.floor(session.constraints.budget * 0.7),
          50
        );
      }
      break;

    case "closer":
      session.constraints.distance = "near";
      break;

    case "more_relaxed":
      session.constraints.mood = "relaxed";
      break;

    case "more_social":
      session.constraints.mood = "social";
      break;

    default:
      return res.status(400).json({ error: "Invalid refine action" });
  }

  // Recalculate confidence
  session.confidence = evaluateConfidence(session.constraints);

  // Regenerate plan
  const newPlan = generatePlan(session.constraints);
  session.currentPlan = newPlan;

  sessionService.save(session);

  res.json({
    plan: newPlan
  });
};
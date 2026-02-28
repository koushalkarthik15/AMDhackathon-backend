const { generatePlan } = require("../utils/planningengine");
const { buildSchedule } = require("../utils/scheduleBuilder");
const sessionService = require("../services/session.service");

exports.handlePlan = (req, res) => {
  const { sessionId } = req.body;

  const session = sessionService.get(sessionId);
  if (!session) {
    return res.status(400).json({ error: "Session not found" });
  }

  const logicalPlan = generatePlan(session.constraints);

  if (!logicalPlan.activities.length) {
    return res.json({ plan: logicalPlan });
  }

  const scheduled = buildSchedule(logicalPlan.activities, session.constraints);

  const finalPlan = {
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

  session.currentPlan = finalPlan;
  sessionService.save(session);

  res.json({ plan: finalPlan });
};
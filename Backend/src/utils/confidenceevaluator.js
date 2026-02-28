function evaluateConfidence(constraints) {
  let score = 0;

  if (constraints.timeMinutes) score += 0.3;
  if (constraints.budget) score += 0.3;
  if (constraints.mood) score += 0.2;
  if (constraints.distance) score += 0.2;

  return score;
}

module.exports = { evaluateConfidence };
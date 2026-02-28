const WALK_SPEED_KMH = 5;
const WALK_DISPLAY_THRESHOLD = 0.2;

function calculateDistanceKm(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy) * 0.2;
}

function walkingMinutes(distanceKm) {
  return Math.ceil((distanceKm / WALK_SPEED_KMH) * 60);
}

function formatTime(date) {
  return date.toTimeString().slice(0, 5);
}

function buildSchedule(selectedActivities, constraints) {
  const now = new Date();
  let currentTime = new Date(now);

  const schedule = [];
  let totalDistance = 0;
  let totalCost = 0;

  let previousLocation = { x: 0, y: 0 };

  for (const activity of selectedActivities) {

    const distanceKm = calculateDistanceKm(previousLocation, activity.location);
    const roundedDistance = parseFloat(distanceKm.toFixed(2));

    if (roundedDistance >= WALK_DISPLAY_THRESHOLD) {
      const walkStart = new Date(currentTime);
      const walkTime = walkingMinutes(roundedDistance);

      currentTime.setMinutes(currentTime.getMinutes() + walkTime);

      schedule.push({
        name: `Walk to ${activity.name}`,
        startTime: formatTime(walkStart),
        endTime: formatTime(new Date(currentTime)),
        duration: walkTime,
        category: "outdoor",
        description: `${roundedDistance} km walk`
      });

      totalDistance += roundedDistance;
    }

    const activityStart = new Date(currentTime);
    currentTime.setMinutes(currentTime.getMinutes() + activity.duration);

    schedule.push({
      name: activity.name,
      startTime: formatTime(activityStart),
      endTime: formatTime(new Date(currentTime)),
      duration: activity.duration,
      category: activity.category,
      description: activity.description
    });

    totalCost += activity.cost;
    previousLocation = activity.location;

    // Optional transition buffer
    if (constraints.transitionBuffer) {
      currentTime.setMinutes(
        currentTime.getMinutes() + constraints.transitionBuffer
      );
    }
  }

  const timeWindow =
    schedule.length > 0
      ? `${schedule[0].startTime} - ${schedule[schedule.length - 1].endTime}`
      : null;

  return {
    timeWindow,
    schedule,
    totalDistanceKm: parseFloat(totalDistance.toFixed(2)),
    totalCost
  };
}

module.exports = { buildSchedule };
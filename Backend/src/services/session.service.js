const SESSION_TTL = 30 * 60 * 1000; // 30 minutes

class SessionService {
  constructor() {
    this.sessions = new Map();
  }

  get(sessionId) {
    const session = this.sessions.get(sessionId);

    if (!session) return null;

    if (Date.now() - session.lastUpdated > SESSION_TTL) {
      this.sessions.delete(sessionId);
      return null;
    }

    return session;
  }

  create(sessionId) {
    const newSession = {
      sessionId,
      constraints: {
        timeMinutes: null,
        budget: null,
        mood: null,
        distance: null,
        category:null
      },
      confidence: 0,
      planStatus: "draft",
      currentPlan: null,
      lastUpdated: Date.now()
    };

    this.sessions.set(sessionId, newSession);
    return newSession;
  }

  save(session) {
    session.lastUpdated = Date.now();
    this.sessions.set(session.sessionId, session);
  }
}

module.exports = new SessionService();
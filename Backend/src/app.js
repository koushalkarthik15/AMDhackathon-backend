const express = require("express");
const chatRoutes = require("./routes/chat.routes");
const planRoutes = require("./routes/plan.routes");
const refineRoutes = require("./routes/refine.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();
const cors = require("cors");
app.use(cors());
// Middlewares
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Routes
app.use("/chat", chatRoutes);
app.use("/plan", planRoutes);
app.use("/refine", refineRoutes);

// Error handler
app.use(errorMiddleware);

module.exports = app;
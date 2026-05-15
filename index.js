require("dotenv").config();

const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

// Allow requests from any origin
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use(require("./middleware/logger"));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true in production with HTTPS
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

// Serve static frontend
app.use("/public", express.static(path.join(__dirname, "public")));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Notes API",
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// Start server only if run directly
if (require.main === module) {
  const { connectDb } = require("./config/db");

  const PORT = process.env.PORT || 3000;

  connectDb()
    .then(() => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      process.exit(1);
    });
}

module.exports = app;

const cors = require("cors")
const logger = require("morgan")
const mongoose = require("mongoose")

const originUrl = process.env.ORIGIN || "http://localhost:5173"

// Access to environment variables/settings
require("dotenv").config()

// Connects to the database
require("./db")

// Handles http requests (express is node js framework)
const express = require("express")
const app = express();
app.use(express.json());

// CORS Setup - To allow requests from Frontend
const allowedOrigins = [
  process.env.ORIGIN,
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS blocked for origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(logger("dev"))
// This function is getting exported from the config folder. Runs most pieces of middleware
require("./config")(app)

// ROUTES HANDLING
app.use("/api", require("./routes/index.routes"))
app.use("/auth", require("./routes/auth.routes"))
app.use("/user", require("./routes/user.routes"))
app.use("/", require("./routes/cafe.routes"))
app.use("/", require("./routes/review.routes"))
app.use("/", require("./routes/contact.routes"))

// ERROR HANDLING
require("./error-handling")(app)

module.exports = app
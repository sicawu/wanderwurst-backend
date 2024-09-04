const cors = require("cors")
const logger = require("morgan")

const originUrl = process.env.ORIGIN || "http://localhost:5173"
// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config()

// ℹ️ Connects to the database
require("./db")

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express")

const app = express()

// CORS Setup - To allow requests from Frontend
app.use(
  cors({
    origin: [originUrl],
  })
);

app.use(logger("dev"))

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app)

// 👇 Start handling routes here
app.use("/api", require("./routes/index.routes"))
app.use("/auth", require("./routes/auth.routes"))
app.use("/", require("./routes/cafe.routes"))
app.use("/", require("./routes/review.routes"))

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app)

module.exports = app
const cors = require("cors")
const logger = require("morgan")


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
app.use(
  cors({
    origin: [originUrl],
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
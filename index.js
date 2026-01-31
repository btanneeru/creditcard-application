const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const health = require("./src/v1/utils/health");
const mongoSanitize = require("express-mongo-sanitize");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Remove any keys containing prohibited characters
app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.log(
        `Request: ${req.originalUrl} | This request[${key}] is sanitized`
      );
    },
  })
);

// enables cors
app.use(cors());

// Add Body Parser
app.use(bodyParser.json({ limit: "60mb" }));
app.use(bodyParser.urlencoded({ limit: "60mb", extended: true }));

// Setting Res Headers
let setOrigin = "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", setOrigin);
  res.setHeader("Cache-Control", 9600);
  next();
});

// HTTP request logger
app.use(require("morgan")("dev"));

// Load env variables
require("./config/envConfig").config();
console.log(`APP_ENVIRONMENT:::: ${process.env.env || process.env.ENV}`);

// Mongo DB Connection
require("./config/mongodb").connectWithRetry();

// Routing for user module
app.use("/api/user", require("./src/user/routes/auth"));

// Routing endpoints for creditcard modules
app.use("/api/v1/applications", require("./src/v1/routes/application"));

// Endpoint for Checking application health
app.use("/api/health-check", health.check);

// Root endpoint
app.get("/", (req, res) => {
  res.send(
    "Welcome To Credit Card Application API, Pls refer API Doc for Using this application: http://localhost:5000/api-docs/"
  );
});


const port = 5000;
if (process.env.env !== "test") {
  server.listen(port, (err) => {
    if (err) {
      console.log("Error::", err);
    }
    console.log(`Running Node server from port - ${port}`);
  });
}

module.exports = app;

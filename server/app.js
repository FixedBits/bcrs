/**
 * Title: app.js
 * Author: Professor Krasso
 * Date: 07/03/2024
 * Description: Server for the app
 */

"use strict";

// Require statements
const express = require("express");
const createServer = require("http-errors");
const path = require("path");
const userRoutes = require("./routes/employee-route");

//The signinRoute variable
const signinRoute = require("./routes/signin-route");

// This imports the security router
const securityRouter = require("./routes/security");

//Swagger variables
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express"); // Import swaggerUi

// Create the Express app
const app = express();

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/bcrs")));
app.use("/", express.static(path.join(__dirname, "../dist/bcrs")));

// Define swagger options.
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "BCRS APIs",
      description: "API for employees",
    },
  },
  apis: ["./server/routes/*.js"],
};

// Initialize Swagger.
const swaggerSpecification = swaggerJsdoc(swaggerOptions);

// Serve Swagger documentation - Swagger UI middleware.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecification));

app.use("/api/users", userRoutes); // Use the employee route
app.use("/api/verify", securityRouter); // Use security route
app.use("/signin", signinRoute); // Use signin route

// error handler for 404 errors
app.use(function (req, res, next) {
  next(createServer(404)); // forward to error handler
});

// error handler for all other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500); // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

// Express.js listening on port 3001
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; // export the Express application

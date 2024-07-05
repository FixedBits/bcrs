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

// Create the Express app
const app = express();

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/bcrs")));
app.use("/", express.static(path.join(__dirname, "../dist/bcrs")));

// error handler for 404 errors
app.use(function (req, res, next) {
  next(createServer(404)); // forward to error handler
});

app.use("/api/users", userRoutes);

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

module.exports = app; // export the Express application

/**
 * Title: employee-routes.js
 * Author: Victor Soto
 * Date: 07/03/2024
 * Description: Employee routes, use database SwaggerUI/
 */

"use strict";

// Import the 'express' module
const express = require("express");
// Create a new router object from the Express module
const router = express.Router();
// Import the 'http-errors' module to create HTTP error objects
const createError = require("http-errors");
// Import the 'mongo' function from the 'mongo' module in the 'utils' directory
const { mongo } = require("../utils/mongo");

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - BCRS - User Operations
 *     summary: Fetch all users
 *     description: Fetch all users from the employees collection in the MongoDB database
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   address:
 *                     type: string
 *                   isDisabled:
 *                     type: boolean
 *                   role:
 *                     type: string
 *                   selectedSecurityQuestions:
 *                     type: array
 *                     items:
 *                       type: string
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: No employees found
 *       '500':
 *         description: Internal Server Error
 */

// Define a GET route for the root ("/") of  application
router.get("/", (req, res, next) => {
  // Try-catch block to handle any potential errors
  try {
    // Connect to the MongoDB database
    mongo(async (db) => {
      // Fetch all users from the employees collection in the database
      const users = await db.collection("employees").find().toArray();

      // Log the fetched users to the console
      console.log("findallusers", users);

      // If no users are found, return a 404 error
      if (!users) {
        return next(createError(404, "No employees found"));
      }

      // Send the fetched users as the response
      res.send(users);
    }, next);
  } catch (err) {
    // If an error occurs, log the error and pass it to the next middleware
    console.error("err", err);
    next(err);
  }
});

/**
 * @openapi
 * /api/users/{userId}:
 *   get:
 *     tags:
 *       - BCRS - User Operations
 *     summary: Fetch a user by their ID
 *     description: Fetch a user by their ID from the employees collection in the MongoDB database
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to fetch
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 address:
 *                   type: string
 *                 isDisabled:
 *                   type: boolean
 *                 role:
 *                   type: string
 *                 selectedSecurityQuestions:
 *                   type: array
 *                   items:
 *                     type: string
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: No employee found with the given ID
 *       '500':
 *         description: Internal Server Error
 */

// Define a GET route to find a user by ID
router.get("/:userId", (req, res, next) => {
  // Try-catch block to handle any potential errors
  try {
    // Connect to the MongoDB database
    mongo(async (db) => {
      // Fetch the user with the specified ID from the employees collection in the database
      // The findOne method returns the first document that matches the query
      const user = await db.collection("employees").findOne({ _id: req.params.userId });

      // Log the fetched user to the console
      console.log("findUserById", user);

      // If no user is found, return a 404 error
      if (!user) {
        return next(createError(404, "No employee found with the given ID"));
      }
      // Send the fetched user as the response
      res.send(user);
    }, next);
  } catch (err) {
    // If an error occurs, log the error and pass it to the next middleware
    console.error("err", err);
    next(err);
  }
});

module.exports = app;

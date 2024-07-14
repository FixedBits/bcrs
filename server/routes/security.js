/**
 * Author: Victor Soto
 * Date: 7/13/24
 * Title: security.js
 * Description: The API's for the security routes
 */

"use strict";

// Require Statements
const express = require("express"); // This imports the express.js library for handling server operations
const { mongo } = require("../utils/mongo"); // This imports the 'mongo' object from the local 'utils/mongo' module
const Ajv = require("ajv"); // This imports the Ajv library for JSON schema validation
const bcrypt = require("bcryptjs"); // This imports the bcrypt.js library for password hashing

const router = express.Router(); // This creates a new instance of the express.Router class
const ajv = new Ajv(); // This creates a new instance of the Ajv class
const saltRounds = 10; // This sets the number of salt rounds

// This is the schema for securityQuestions API
const securityQuestionsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      question: { type: "string" },
      answer: { type: "string" },
    },
    required: ["question", "answer"],
    additionalProperties: false,
  },
};

const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
};

// This API verifies a user's security questions
router.post("/employees/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email; // This captures the 'email' parameter
    const { selectedSecurityQuestions } = req.body; // This captures the request body
    console.log('Logging the request body', req.body)

    console.log("Employee email", email); // This logs the email to the console
    console.log("Selected Security Questions", selectedSecurityQuestions); // This logs the securityQuestions object to the console

    // This validates the securityQuestions object against the securityQuestionsSchema
    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(selectedSecurityQuestions);

    // This returns a 400 error if the securityQuestions object is invalid
    if (!valid) {
      const err = new Error("Bad Request"); // This creates a new Error object
      err.status = 400; // This sets the error status to 400
      err.errors = validate.errors; // This sets the error object's errors property to the validate.errors object
      console.log("securityQuestions validation errors", validate.errors);
      next(err); // This passes the error to the next middleware in the stack
      return; // Return to exit the function
    }
    // This calls the mongo module to pass in the operations function
    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne({ email: email }); // This finds the employee by email

      // if the employee is not found, this will return a 404 error
      if (!employee) {
        const err = new Error("Not Found"); // This creates a new Error object
        err.status = 404; // This sets the error status to 404
        console.log("Employee not found", err); // This logs the error to the console
        next(err); // This passes the error to the next middleware in the stack
        return; // Return to exit the function
      }

      console.log("Selected Employee", employee); // This logs the employee object to the console

      // This returns a 401 error if the security questions do not match
      if (
        selectedSecurityQuestions[0].answer !==
          employee.selectedSecurityQuestions[0].answer ||
        selectedSecurityQuestions[1].answer !==
          employee.selectedSecurityQuestions[1].answer ||
        selectedSecurityQuestions[2].answer !==
          employee.selectedSecurityQuestions[2].answer
      ) {
        const err = new Error("Unauthorized"); // This creates a new Error object
        err.status = 401; // This sets the error status to 401
        err.message = "Unauthorized: Security questions do not match"; // This sets the error message to 'Security questions do not match'
        console.log("Security questions do not match", err); // This logs the error to the console
        next(err); // This passes the error to the next middleware in the stack
        return; // Return to exit the function
      }

      res.send(employee); // This returns the employee object to the client
    }, next);
  } catch (err) {
    console.log(`API Error: ${err.message}`); // This logs the error to the console
    next(err); // This passes the error to the next middleware in the stack
  }
});

// resetPassword API

router.post("/employees/:email/reset-password", (req, res, next) => {
  try {
    const email = req.params.email; // This captures the email parameter
    const user = req.body; // This captures the request body

    console.log("Employee email", email); // This logs the email to the console

    // This validates the password object against the resetPasswordSchema
    const validate = ajv.compile(resetPasswordSchema);
    const valid = validate(user);

    // This returns a 400 error to the client if the password object is not valid
    if (!valid) {
      const err = new Error("Bad Request"); // This creates a new Error object
      err.status = 400; // This sets the error status to 400
      err.errors = validate.errors; // This sets the error object's errors property to the validate.errors object

      console.log("password validation errors", validate.errors); // This logs out the errors to the console
      next(err); // This passes the error to the next middleware in the stack
      return; // Return to exit the function
    }

    // This calls the mongo module and pass in the operations function
    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne({ email: email }); // This finds the employee by email

      // This returns the 404 error to the client if the employee is not found
      if (!employee) {
        const err = new Error("Not Found"); // This creates a new Error object
        err.status = 404; // This sets the error status to 404

        console.log("Employee", err); // This logs the error to the console
        next(err); /// This passes the error to the next middleware in the stack
        return; // Return to exit the function
      }
      console.log("Selected Employee", employee); // This logs the employee object to the console

      const hashedPassword = bcrypt.hashSync(user.password, saltRounds); // This hashes the password

      // This updates the employee document with the new hashed password
      const result = await db.collection("employees").updateOne(
        { email: email },
        {
          $set: { password: hashedPassword },
        }
      );

      console.log("MongoDB update result", result); // This logs out the result to the console

      res.status(204).send(); // This returns a 204 status code to the client
    }, next);
  } catch (err) {
    console.log(`API Error: ${err.message}`); // This logs out the error to the console
    next(err); // This passes the error to the next middleware in the stack
  }
});

module.exports = router;

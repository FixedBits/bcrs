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



// This is the schema for resetPassword API

const resetPasswordSchema = {
  type: "object",
  properties: {
    password: { type: "string" },
  },
  required: ["password"],
  additionalProperties: false,
};

/**
 * @openapi
 * /api/verify/employees/{email}/security-questions:
 *   post:
 *     tags:
 *       - Verify Security Questions
 *     summary: Verify a user's security questions
 *     description: This API verifies a user's security questions by comparing the answers provided in the request body with the ones stored in the database.
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the user to verify
 *     requestBody:
 *       description: The security questions and answers to verify
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                 answer:
 *                   type: string
 *               required: ["question", "answer"]
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
 *                   question:
 *                     type: string
 *                   answer:
 *                     type: string
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */



/**
 * @openapi
 * /api/verify/security/employees/{email}/reset-password:
 *   post:
 *     tags:
 *       - Reset Password
 *     summary: Reset a user's password
 *     description: This API resets a user's password by updating the password in the database.
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email of the user to reset the password
 *     requestBody:
 *       description: The new password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required: ["password"]
 *             additionalProperties: false
 *     responses:
 *       '200':
 *         description: Password Changed
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

// resetPassword API

router.post("/security/employees/:email/reset-password", (req, res, next) => {
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

      res.status(200).send("Success! Password reset complete."); // This returns a 200 status code to the client
    }, next);
  } catch (err) {
    console.log(`API Error: ${err.message}`); // This logs out the error to the console
    next(err); // This passes the error to the next middleware in the stack

  }
})
// findSelectedSecurityQuestions API
router.get("/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email; // pulls email value from route
    console.log("Email address:", email); // for troubleshooting purposes

    mongo(async (db) => {
      const employee = await db
        .collection("employees")
        .findOne(
          { email: email },
          { projection: { email: 1, selectedSecurityQuestions: 1 } }
        );

      console.log("Selected security questions", employee);

      if (!employee) {
        const err = new Error("Unable to find user with email" + email);
        err.status = 404;
        console.log("err", err); // for troubleshooting purposes
        next(err);
        return;
      }

      res.send(employee);
    }, next);
  } catch (err) {
    console.log("err", err); // log for troubleshooting
    next(err);
  }
});


module.exports = router;

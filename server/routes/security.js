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




/**
 * Signin
 * @openapi
 * /api/security/signin:
 *   post:
 *     tags:
 *       - Signin
 *     description: Signs in  the user.
 *     summary: User Signin
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User logged in Successfully
 *       '400':
 *         description: Bad Request
 *       '500':
 *         description: Internal Server Error
 */


//The signinSchema which requires and email and a password to sign in to the application
const signinSchema = {
  //JSON type object is a structured object with string keys that each have a typed value
  type: 'object',
  properties: {
    email: { type: 'string'},
    password: { type: 'string'}
  },

  required: ['email', 'password'],
  additionalProperties: false,
}

router.post('/signin', async (req, res, next) => {
  try {

    // A variable that captures the request body
    const signin = req.body;

    //Logging the request for troubleshooting
    console.log('Sign in object:', signin);

    //Use ajv to match signin information with the schema
    const validator = ajv.compile(signinSchema);
    const isValid = validator(signin)

    // Check to see if the if the signin matches otherwise return an error for a bad request
    if(!isValid){
      const err = new Error('Bad Request')
      err.status = 400;
      err.errors = validator.errors;
      console.log('Signin validation errors:', validator.errors)// logs out the errors to the console
      next(err) //returns the next error
      return //exits the function
    }

    /**
     * The mongo function is used to interact with the mongodb database. It creates an asynchronous callback function where database operations are performed.
     */
    mongo(async (db) => {
      //This searches for one employee by email
      let employee = await db.collection('employees').findOne({ email: signin.email});
      console.log('employee:', employee)

      if(!employee) {
        const err = new Error('Employee not found');
        err.status = 404;
        console.log('Employee not found', err);
        next(err);
        return;
      }

      console.log('Stored password:', employee.password)

      // This compares the password in the signin object to the password in the employee document
      let passwordIsValid = bcrypt.compareSync(signin.password, employee.password)

      //Debugging entered password and comparison result
      console.log('Entered password:', signin.password)
      console.log('Password is valid:', passwordIsValid)
      // If the password is not valid return a 401 error to the client


      res.send(employee) //return the employee object to the client



    }, next)

  } catch (err) {
    console.log(`API Error: ${err.message}`); // log out the error to the console
    next(err)
  }
})


/**
 * verifyUsers
 * @openapi
 * /api/security/verify/employees/{email}:
 *   post:
 *     tags:
 *       - Verify Employees
 *     name: verifyEmployees
 *     description: API for verifying a user by email.
 *     summary: Verifies an existing email.
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         description: The email address of the user to verify.
 *     requestBody:
 *       required: true
 *       content:
 *           schema:
 *             type: string
 *     responses:
 *       '200':
 *         description: User verified by email
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * The API to verify the user's email address
 */

router.post('/employees/:email', (req, res, next) => {
  try {
    const email = req.params.email // Using params captures the entered email by the user in the post route
    console.log('Employee email: ', email) // log out the email variable to the console

    // call mongo
    mongo(async db => {
      const employee = await db.collection('employees').findOne({email: email}) // find the employee document by email

      //if the employee is null then return a 404 error to the client
      if (!employee) {
        const err = new Error('Not Found') // create a new error object
        err.status = 404 // set the error status to 404
        console.log('Employee not found: ', err) // log out the error to the console
        next(err) // return the error the client
        return // return to exit the function
      }

      console.log('Selected employee: ', employee) // log out the employee object to the console

      // send  back the employee object to the client
      res.send(employee)
    }, next)
  } catch (err) {
    console.log(`API Error: ${err.message}`) // log out the error to the console
    next(err) // return the error to the client
  }
})




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

router.post("/verify/users/:email/reset-password", (req, res, next) => {
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
router.get("/verify/users/:email/security-questions", (req, res, next) => {
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


/**
 * The following API relates to the userRoutes variable meaning:
 *
 * app.use("/api/users", userRoutes); // Use the employee route
 *
 * Therefore the first part of the route above must be included
 * when it is called elsewhere otherwise it will not function.
 *
 */


// This API verifies a user's security questions
router.post("/verify/users/:email/security-questions", (req, res, next) => {
  try {
    const email = req.params.email; // This captures the 'email' parameter
    let {securityQuestions} = req.body; // This captures the request body

    console.log("Logging the request body", req.body);

    console.log("Employee email", email); // This logs the email to the console
    console.log("Selected Security Questions", securityQuestions); // This logs the securityQuestions object to the console

    // This validates the securityQuestions object against the securityQuestionsSchema
    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(securityQuestions);

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
        securityQuestions[0].answer !==
          employee.selectedSecurityQuestions[0].answer ||
        securityQuestions[1].answer !==
          employee.selectedSecurityQuestions[1].answer ||
        securityQuestions[2].answer !==
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


module.exports = router;

/**
 * Title: employee-route.js
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
// This line imports a specific function from the MongoDB library that generates unique identifiers for database entries.
const { ObjectId } = require("mongodb");

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
      const user = await db
        .collection("employees")
        .findOne({ _id: req.params.userId });

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


//---------------------------------------------------------------------------------------------------------------------------------

/**
 * DeVonte' Ellis
 * Create Employee API
 * 7/3/24
 */

router.post('/', (req, res, next) => {
  try {

    const { employee } = req.body //the employee object
    console.log('employee', employee) //log the employee object to the console

    const validator = ajv.compile(employeeSchema) //compiling the employee schema
    const valid = validator(employee) // test to see if the employee object is valid with the schema

    if (!valid) {
      const err = new Error ('Bad Request')
      err.status = 400
      err.errors = validator.errors
      console.log('req.body validation has failed', err)
      next(err) //forward error to the error handler
      return // return to exit the function
    }

    employee.password = bcrypt.hashSync(employee.password, saltRounds) //hashes the password
    console.log('hashed password', employee.password) //log out the hashed password to the console

    //call the mongo module and pass the operations function
    mongo(async db => {

      console.log('Employee object inside mongo call', employee)
      const result = await db.collection('employees').insertOne(employee) //insert new employee into the database

      console.log('result', result) //log result to the console

      res.json({id: result.insertedId }) //returns the new employee id
    }, next)

  } catch (err) {
    console.log('err', err) //logs the error to the console
    next(err) //forwards error to error handler
  }
})

/**
 * DeVonte' Ellis
 * Update Employee API
 * 7/3/24
 */

router.put('/:empId', (req, res, next) => {
  try {
    let { empId } = req.params //employee id
    empId = parseInt(empId, 10) //parses the empId into an integer (#)

    //return a 400 error code if the employee id isn't a number
    if (isNaN(empId)) {
      // If employee id isn't a number
      const err = new Error('Sorry, the input must be a number')
      err.status = 400
      console.log('err', err)
      next(err) //forward the error to the error handler
      return // return to exit the function
    }

    const { employee } = req.body // employee object

    const validator = ajv.compile(updateEmployeeSchema) // compile the update employee schema
    const valid = validator(employee) //test to see if the employee object is valid vs the schema

    if (!valid) {
      const err = new Error('Bad Request')
      err.status = 400
      err.errors = validator.errors
      console.log('req.body validation has failed', err)
      next(err) // forward the error to the error handler
      return // return to exit the function
    }

    //call to the mongo module and pass in the operations function
    mongo(async db => {

      //query to update the employee object in the database collection
      const result = await db.collection('employees').updateOne(
        { empId },
        { $set: {
          firstName: employee.firstName,
          lastName: employee.lastName,
          role: employee.role}
        }
      ) //update the employee

      console.log('result', result) //log the result to the console

      res.status(204).end() //return a 204 status code
    }, next)

  } catch (err) {
    console.log('err', err) //log out the error to the console
    next(err) //forward the error to the error handler
  }
})


//-----------------------------------------------------------------------------------------------------------------------------------

module.exports = router;

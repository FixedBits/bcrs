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
// Imports a specific function from the MongoDB library
// generates unique identifiers for database entries.
const { ObjectId } = require("mongodb")
const Ajv = require('ajv')
const ajv = new Ajv();
const app = express();
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const saltRounds = 10


app.use(bodyParser.json())
/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - BCRS - User Operations
 *     summary: findAll users
 *     description: findAll users from the employees collection in the MongoDB database
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
      // findAll users from the employees collection in the database
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

  let { userId } = req.params;
  // Try-catch block to handle any potential errors
  try {

    // Connect to the MongoDB database
    mongo(async (db) => {
      // Fetch the user with the specified ID from the employees collection in the database
      // The findOne method returns the first document that matches the query
      const user = await db
        .collection("employees")
        .findOne({ _id: new ObjectId(req.params.userId) });

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
 * createUser
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - createUser
 *     name: createUser
 *     description: API for creating a new User
 *     summary: Creates a new document in the employees collection
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *                   selectedSecurityQuestions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       additionalProperties:
 *                            type: string
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - address
 *               - selectedSecurityQuestions
 *     responses:
 *       '200':
 *         description: New User created
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */


/**
 * DeVonte' Ellis/Evelyn Zepeda
 * Create User API
 * 7/3/24
 */

const userSchema = {
  type: 'object',
  properties: {
    email: { type: 'string'},
    password: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    phoneNumber: { type: 'string' },
    address: { type: 'string' },
    selectedSecurityQuestions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: { type: 'string' }
      }
    },
    role: { type: 'string' },
    isDisabled: { type: 'boolean' }
  },
  required: [
    'email',
    'password',
    'firstName',
    'lastName',
    'phoneNumber',
    'address',
    'selectedSecurityQuestions'
  ],
  additionalProperties: false
};

//The createUser API
router.post('/', (req, res, next) => {
  try {

    //Logging the request body before validation
    console.log(req.body)

    const validator = ajv.compile(userSchema) //compiling the user schema
    console.log("Validator logged", validator)


    const valid = validator(req.body) // test to see if the employee object is valid with the schema
    console.log("Valid logged", valid) //Logging valid

    //If it is not valid send error messaging
    if (!valid) {
      const err = new Error ('Bad Request')
      err.status = 400
      err.errors = validator.errors
      console.log('validator failed', err)
      next(err) //forward error to the error handler
      return // return to exit the function
    }



    let bcryptPassword = bcrypt.hashSync(req.body.password, saltRounds) //hashes the password
    console.log("this is bcrypt password", bcryptPassword)
    console.log('hashed password', bcryptPassword) //log out the hashed password to the console

    //call the mongo module and pass the operations function
    mongo(async db => {

      console.log('The req.body inside the mongo call', req.body)
      const result = await db.collection('employees').insertOne(req.body) //insert new employee into the database

      console.log('result', result) //log result to the console

      res.send("New user created.") //returns the new employee id
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

/**
 * updateUser
 * @openapi
 * /api/users/{email}:
 *   put:
 *     tags:
 *       - Update User
 *     name: updateUser
 *     description: API for updating a user
 *     summary: Updates the User document
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: string
 *             properties:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   address:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *                   role:
 *                     type: string
 *                   isDisabled:
 *                      type: boolean
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - address
 *               - phoneNumber
 *               - role
 *               - isDisabled
 *     responses:
 *       '200':
 *         description:  User updated
 *       '400':
 *         description: Bad Request
 *       '404':
 *         description: Not Found
 *       '500':
 *         description: Internal Server Error
 */

// updateUserSchema
const updateEmployeeSchema = {
  type: "object",
  properties: {
    "email": {
      type: 'string'
    },
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    address: {
      type: "string",
    },
    phoneNumber: {
      type: "string",
    },
    role: {
      type: "string",
    },
    isDisabled: {
      type: "boolean",
    },
  },
  required: [
    "email",
    "firstName",
    "lastName",
    "phoneNumber",
    "address",
    "role",
    "isDisabled",
  ],
  additionalProperties: false,
};



router.put('/:email', (req, res, next) => {
  try {

    //This variable is  mapped to the router's "empId" parameter. The requested parameter after params should match the name in the route above
    let { email } = req.params;


    console.log(email)
    console.log("The request body", req.body)
    //The body is a property that contains data sent by the client in a POST or PUT request. This data is typically parsed JSON or form data
    //let { email } = req.body;

    console.log("Employees before validation:", req.body)


    console.log(email)

    const validator = ajv.compile(updateEmployeeSchema) // compile the update employee schema
    const valid = validator(req.body) //test to see if the employee object is valid vs the schema

    console.log("EmpId", email)
    console.log("Employee:", req.body)
    console.log("Is valid true or false:", valid)

    if (!valid) {
      const err = new Error('Bad Request')
      err.status = 400
      err.errors = validator.errors
      console.log('updateEmployeeSchema validation has failed', err)
      next(err) // forward the error to the error handler
      return // return to exit the function
    }

    //call to the mongo module and pass in the operations function
    mongo(async db => {

      console.log('Query Criteria: ', {email})
      //query to update the employee object in the database collection
      let result = await db.collection('employees').updateOne(
        //Use email as the query to search
        { email: email },

        //Make sure to include all the of the REQUIRED properties defined in the updateUserSchema
        { $set: {
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          address: req.body.address,
          phoneNumber: req.body.phoneNumber,
          role: req.body.role,
          isDisabled: req.body.isDisabled}
        }
      ) //update the employee

      console.log('Result:', result);

      //Matched count means that the query parameter worked and found a matching property
      //If this is at zero it means that nothing was found and there was no match
      if (result.matchedCount === 0) {
        res.status(404).send('Employee not found');
      } else {
        //If a match was found send a 204 status and send the result
        res.send("User has been updated")
      }

    }, next)

  } catch (err) {
    console.log('err', err) //log out the error to the console
    next(err) //forward the error to the error handler
  }
})


//-----------------------------------------------------------------------------------------------------------------------------------
/**Author: Evelyn Zepeda
 * Date: 7/6/24
 * Title: Delete API
 * Description: API that disables users.
 */

/**
 * deleteUser
 * @openapi
 * /api/users/{userId}:
 *  delete:
 *    tags:
 *      - Delete User
 *    description: User is set to disabled
 *    summary: Sets existing user to disabled
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *          description: The user ID
 *    responses:
 *      '200':
 *        description: User document disabled.
 *      '400':
 *        description: Not Found
 *      '500':
 *        description: Internal Server Error
 *
 */

router.delete('/:userId', async (req, res, next) => {

  try {
    let { userId } = req.params;

    mongo(async (db) => {
      // Log the userId to verify it's being received correctly
      console.log('UserId:', userId);


      // Update the user to set isDisabled to true
      await db.collection('employees').updateOne({ _id: new ObjectId(userId) }, { $set: { isDisabled: true } });

      // Find the user in the database
      const user = await db.collection('employees').findOne({ _id: new ObjectId(userId)
      });
      // Log the user
      console.log('User:', user);

      if (!user) {
        console.log('No user found.');
        return next(createError(404, "No employee found."));
      }

      // If user is already disabled will send a message
      if (user.isDisabled === true) {

        //Response MUST be JSON!!!!!
        console.log('User is disabled');
        return; // Return to exit the function
      }

      res.send(user);
    }, next);
  } catch (err) {
    console.error('err', err);
    next(err);
  }
})





module.exports = router;


/**
 * Author: Evelyn Zepeda
 * Date: 7/10/24
 * Title: registration.js
 * Description: The registration routes for the registration API
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const { mongo } = require('../utils/mongo');
const Ajv = require('ajv')
const ajv = new Ajv()

const router = express.Router()

let saltRounds = 10;

/**
 * registerUser
 * @openapi
 * /api/security/registration:
 *   post:
 *     tags:
 *       - Registration
 *     name: registration
 *     description: API for registering a new user
 *     summary: Creates a new user document
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
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
 *                     minItems: 3
 *                     maxItems: 3
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         question:
 *                           type: string
 *                         answer:
 *                           type: string
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - phoneNumber
 *               - address
 *               - question
 *               - answer
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


// Creating the securityQuestionsSchema
const securityQuestionsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      question: { type: 'string'},
      answer: { type: 'string'}
    },
    required: ['question', 'answer'],
    additionalProperties: false
  }
}

// Creating the registerSchema
const registerSchema = {
  type: 'object',
  properties: {
    email: {type: 'string'},
    password: {type: 'string'},
    firstName: {type: 'string'},
    lastName: { type: 'string'},
    phoneNumber: {type: 'string'},
    address: { type: 'string'},
    selectedSecurityQuestions: securityQuestionsSchema
  },
  required: ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address'],
  additionalProperties: false
};


router.post('/registration', (req, res, next ) => {
  try {
    // Logging the request body submitted by the user

    let user = req.body.user

    console.log("User:", user)

    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    console.log('Check fields:', user.email, user.password, user.firstName, user.lastName, user.phoneNumber, user.address, user.selectedSecurityQuestions);

    // Validate the request body and compile it against the registerSchema
    const validate = ajv.compile(registerSchema);

    console.log("Validated request body: ", validate)

    const valid = validate(user);

    console.log("Valid request body: ", valid)

    // If the request body is not valid log a 400 error to the client
    if (!valid) {
      const err = new Error('Bad Request');
      err.status = 400 // Sets the error to 400
      err.errors = validate.errors; // set the error object's property to the validate.errors object
      console.log('Employee validation errors:', validate.errors); // log out hte errors to the console
      next(err); //return the error to the client
      return; // exit the function
    }


    // If the request body is valid, hash the password
    user.password = bcrypt.hashSync(user.password, saltRounds);
    console.log('Hashed password: ', user.password); // log the hashed password to the console

    // Call the mongo module and pass in the operations function
    mongo(async db => {
      const employees = await db.collection('employees').find().sort({_id : 1 }).toArray(); // This sorts the employees by _id in ascending order

      console.log('Employee List: ', employees); // Logs the result of the employees variable

      const employeeExists = employees.find(e => e.email === user.email);

      if(employeeExists) {
        const err = new Error('Bad Request'); // Creates a new error object
        err.status = 400;
        err.message= 'Employee already exists'; //sends a message that the employee already exists
        console.log('Employee already exists', err);
        next(err); // return the error to the client
        return;
      }

      const lastEmployee = employees[employees.length -1] // get the last employee in the array of employees returned from the database
      const newEmail = lastEmployee.email + 1 // Increment the last employees _id by 1

      console.log(`_id: ${lastEmployee._id}; First Name: ${lastEmployee.firstName}; Last Name: ${lastEmployee.lastName}`)
      console.log(`newEmail: ${newEmail}`) // logs the new id to the console

      // Create a new employee object with the new Id and the user object's properties
      const newEmployee = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        address: user.address,
        role: 'standard',
        isDisabled: false,
        selectedSecurityQuestions: user.selectedSecurityQuestions
      };

      console.log('Employee to be inserted into MongoDB: ', newEmployee) // Log the newEmployee object to the console
      const result = await db.collection('employees').insertOne(newEmployee) // Insert the new user

      // Log the result
      console.log('MongoDB insertion result: ', result)

      // Returns the new user id
      res.send( {id: result.insertedId})
    }, next)
  } catch(err) {
    console.log(err)
    console.log(`API Error: ${err.message}`) // Logs the error to the console
    next(err) // return the error to the client
  }
})

module.exports = router;
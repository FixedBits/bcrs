/**
 * Author: Evelyn Zepeda
 * Date: 7/3/24
 * Title: bcrs-routes.js
 * Description: The API's for the applications routes.
 */


const express = require('express');
const router = express.Router();
const { mongo } = require('../utils/mongo');
const Ajv = require('ajv')
const ajv = new Ajv();
//bcrypt variables
const bcrypt = require('bcryptjs')
const saltRounds = 10;

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
    selectedSecurityQuestions: securityQuestionsSchema
  },
  required: ['email', 'password', 'firstName', 'lastName'],
  additionalProperties: false
};


router.post('/register', (req, res, next ) => {
  try {
    // Logging the request body submitted by the user
    console.log(req.body);

    // Validate the request body and compile it against the registerSchema
    const validate = ajv.compile(registerSchema);
    const valid = validate(req.body);

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
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    console.log('Hashed password: ', req.body.password); // log the hashed password to the console

    // Call the mongo module and pass in the operations function
    mongo(async db => {
      const employees = await db.collection('employees').find().sort({_id : 1 }).toArray(); // This sorts the employees by _id in ascending order

      console.log('Employee List: ', employees); // Logs the result of the employees variable

      const employeeExists = employees.find(e => e.email === req.body.email);

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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: newEmail,
        password: req.body.password,
        role: 'standard',
        selectedSecurityQuestions: req.body.selectedSecurityQuestions
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
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

module.exports = router;
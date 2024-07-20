/**
 * Author: Evelyn Zepeda
 * Date: 7/19/24
 * Title: invoice.js
 * Description: createInvoice and findPurchasesByService API's
 */

const express = require('express')
const { mongo } = require('../utils/mongo')
const Ajv = require('ajv')
const ajv = new Ajv();
const app = express();
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')
const saltRounds = 10

const router = express.Router();


app.use(bodyParser.json())

//
const selectedProducts = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      price: {
        type: 'number',
      },
    },
    required: ['name', 'price'],
    additionalProperties: false,
  }
}

const invoiceSchema = {
  type: 'object',
  properties: {
    invoiceId: { type: 'string'},
    orderDate: { type: 'string'},
    email: {type: 'string'},
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    partsTotal: { type: 'number'},
    laborTotal: { type: 'number'},
    productTotal: {type: 'number'},
    invoiceTotal: { type: 'number'},
    products: selectedProducts
  },
  required: [
    'invoiceId',
    'email',
    'orderDate',
    'firstName',
    'lastName',
    'partsTotal',
    'laborTotal',
    'invoiceTotal',
    'products'
  ]
}

// createInvoice API
router.post('/', async (req, res, next) => {
    try {

      const invoice = req.body

    // Log the request body submitted by the user
    console.log('The request body in a variable named invoice:',invoice);

    const validator = ajv.compile(invoiceSchema); // compiles the invoiceSchema
    const valid = validator(req.body) // test to see if the two are valid compared to each other
    console.log("Validator logged", valid)

    // if not valid send a bad request message error 400
    if(!valid){
      const err = new Error('Bad Request');
      err.status = 400;
      err.errors = validator.errors;
      console.log('Validation failed: ', err)
      next(err)
      return
    }

    // connect to the mongodb collection in the database named invoices
    mongo(async (db) => {
      // a variable that contains the inserted invoice into the invoice collection
      const total = await db.collection('invoices').insertOne(invoice)

      console.log('The total inserted into the invoice collection:', total);

      console.log(({id: total.insertedId}))
    })

    } catch(err){
      console.log('err', err);
      next(err)
    }
  }
)

// export the router so you have access from app.js
module.exports = router;
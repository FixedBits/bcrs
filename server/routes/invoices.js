const express = require('express');
const { mongo } = require('../utils/mongo');
const Ajv = require('ajv');
const ajv = new Ajv();
const app = express();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ObjectId } = require('mongodb'); // Import ObjectId


const router = express.Router();

app.use(bodyParser.json());

/**
 * createInvoice
 * @openapi
 * /api/invoices:
 *   post:
 *     tags:
 *       - Invoices
 *     description: API for creating a new invoice.
 *     summary: Creates a new invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Customers email address.
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *                 description: Customers full name.
 *               date:
 *                 type: string
 *               menuItems:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Service title of the line item.
 *                     price:
 *                       type: number
 *                       description: Price/amount of the line item.
 *                 description: An array of line items for the invoice.
 *               parts:
 *                 type: number
 *                 description: Total amount for the parts.
 *               labor:
 *                 type: number
 *                 description: Total amount for the labor.
 *               orderTotal:
 *                 type: number
 *                 description: Total for the order.
 *             required:
 *               - email
 *               - firstName
 *               - lastName
 *               - parts
 *               - labor
 *               - orderTotal
 *               - menuItems
 *               - date
 *     responses:
 *       201:
 *         description: Invoice created
 *       404:
 *         description: Not Found
 *       500:
 *         description: Internal Server Error
 */


const menuItemsSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      price: { type: 'number' },
    },
    required: ['name', 'price'],
  },
};

const invoiceSchema = {
  type: 'object',
  properties: {
    invoiceId: { type: 'string' },
    date: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    parts: { type: 'number' },
    labor: { type: 'number' },
    orderTotal: { type: 'number' },
    menuItems: menuItemsSchema,
  },
  required: [
    'email',
    'date',
    'firstName',
    'lastName',
    'parts',
    'labor',
    'orderTotal',
    'menuItems',
  ],
};

// Create invoice API
router.post('/', async (req, res, next) => {
  try {
    const invoice = req.body;

    // Log the request body
    console.log('The request body in a variable named invoice:', invoice);

    // Validate the invoice against the schema
    const validator = ajv.compile(invoiceSchema);
    const valid = validator(invoice);
    console.log('Validator logged', valid);

    // If not valid, send a bad request message with error details
    if (!valid) {
      const err = new Error('Bad Request');
      err.status = 400;
      err.errors = validator.errors;
      console.log('Validation failed: ', err);
      return next(err);
    }

    // Connect to the MongoDB collection and insert the invoice
    mongo(async (db) => {
      try {
        const result = await db.collection('invoices').insertOne(invoice);
        console.log('The total inserted into the invoice collection:', result);
        res.status(201).json({ id: result.insertedId }); // Respond with the inserted ID
      } catch (insertError) {
        console.error('Error inserting invoice:', insertError);
        next(insertError);
      }
    }, next);
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
});

// Get invoice by ID
router.get('/:id/invoice', (req, res, next) => {
  try {
    const id = req.params.id;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Bad Request' });
    }

    // Connect to the MongoDB collection and find the invoice
    mongo(async (db) => {
      try {
        const invoice = await db.collection('invoices').findOne({id: parseInt(id)});

        if (!invoice) {
          const err = new Error('Could not find an invoice for id:' + id);
          err.status = 404;
          console.log('Error:', err);
          return next(err);
        }

        res.status(200).json(invoice); // Changed to 200 OK for successful retrieval
      } catch (findError) {
        console.error('Error finding invoice:', findError);
        next(findError);
      }
    }, next);
  } catch (err) {
    console.error('Error:', err);
    next(err);
  }
});

module.exports = router;

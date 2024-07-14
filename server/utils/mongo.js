/**
 * Author: Evelyn Zepeda
 * Date: 7/3/24
 * Title: mongo.js
 * Description: Connects to mongodb database
 */

//Database connection file
//Will not be using mongoose we will be using mongodb driver
"use strict";

const { MongoClient } = require("mongodb");

const MONGO_URL =
  "mongodb+srv://web450_admin:secret123@bellevueuniversity.8vzftv7.mongodb.net/web450DB?retryWrites=true&w=majority&appName=BellevueUniversity";

/* 'mongodb+srv://web450_admin:secret123@bellevueuniversity.8vzftv7.mongodb.net/?retryWrites=true&w=majority&appName=BellevueUniversity'
each time a person logs in the default will be standard
create user everyone is standard
in the databse there will be a role
we will default it to standard so everytime someone logs in
in teh edit user config is wehre you can change that value from standard to admin */

const mongo = async (operations, next) => {
  try {
    console.log("Connecting to the database...");

    // Connect to the MongoDB server with the provided URL and options
    const client = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db("web450DB");
    console.log("Connected to the database!");

    // Perform the operations passed to the 'mongo' function
    await operations(db);
    console.log("Operation was successful!");

    // Close the database connection
    client.close();

    // Log successful disconnection from the database
    console.log("Disconnected from the database.");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    err.status = 500;

    console.error("Error connecting to the database:", err);
    next(err);
  }
};

// Export the 'mongo' function
module.exports = { mongo };

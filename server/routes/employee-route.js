/**
 * Title: employee-route.js
 * Author: Victor Soto
 * Date: 07/03/2024
 * Description: Employee routes, use database SwaggerUI/
 */

"use strict";

//requirement statements
const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const { mongo } = require("../utils/mongo");

router.get("/"),
  (req, res, next) => {
    try {
      mongo(async (db) => {
        TODO
        const users = await db.collection("users-collection").find().toArray();

        console.log("findallusers", users);

        if (!users) {
          return next(createError(404, "No employees found"));
        }

        res.send(users);
      }, next);
    } catch (err) {
      console.error("err", err);
      next(err);
    }
  };

module.exports = app;
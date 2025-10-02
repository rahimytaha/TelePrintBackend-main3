/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/client/v1/nodemailer");

router.post("/", Controller.createOrder.bind(Controller));

module.exports = router;

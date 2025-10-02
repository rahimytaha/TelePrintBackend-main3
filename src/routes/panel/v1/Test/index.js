/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/panel/v1/Test");

router.post("/", Controller.testEmail.bind(Controller));

module.exports = router;

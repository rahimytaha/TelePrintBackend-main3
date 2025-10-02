/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/client/v1/Flyer_EndFormat");

router.get("/", Controller.getAll.bind(Controller));

module.exports = router;

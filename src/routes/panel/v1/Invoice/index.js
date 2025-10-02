/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/panel/v1/Invoice");
const { AdminToken } = require("../../../../middlewares/TokenAuth");

router.get("/", AdminToken, Controller.getAll.bind(Controller));
router.post("/test", AdminToken, Controller.test.bind(Controller));
router.get("/id/:id", AdminToken, Controller.getById.bind(Controller));
router.put("/:id", AdminToken, Controller.updateStatus.bind(Controller));
router.get("/status", AdminToken, Controller.getAllStatus.bind(Controller));

module.exports = router;

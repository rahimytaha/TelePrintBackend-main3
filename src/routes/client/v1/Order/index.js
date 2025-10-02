/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/client/v1/Order");
const { UserToken } = require("../../../../middlewares/TokenAuth");
router.post("/order/get", UserToken, Controller.getAll.bind(Controller));
router.get("/status/get", Controller.getAllStatus.bind(Controller));
router.post("/", Controller.payment.bind(Controller));
router.post("/paypal/start", Controller.paypalStart.bind(Controller));
router.post("/paypal/payment", Controller.paypalPayment.bind(Controller));
router.post("/confirm/webhook", Controller.callbackStripe.bind(Controller));
router.get("/:id", Controller.getById.bind(Controller));
router.delete("/:id", Controller.DeleteOrder.bind(Controller));
router.post("/test", Controller.testOrder.bind(Controller));

module.exports = router;

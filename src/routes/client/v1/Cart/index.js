/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/client/v1/Cart")
const { UserTokenRequire } = require("../../../../middlewares/TokenAuth")
router.post("/cart/get", UserTokenRequire, Controller.getCart.bind(Controller))
router.put("/cart/:cartId", UserTokenRequire, Controller.setShipmentCart.bind(Controller))
router.get("/invoice/:id", UserTokenRequire, Controller.getPdf.bind(Controller))
router.get("/status/get", Controller.getAllStatus.bind(Controller))
router.post("/", UserTokenRequire, Controller.payment.bind(Controller))
router.post("/spotPayment", UserTokenRequire, Controller.spotPayment.bind(Controller))
router.get("/verify", Controller.verify.bind(Controller))
router.post("/paypal/start", UserTokenRequire, Controller.paypalStart.bind(Controller))
router.post("/paypal/payment", UserTokenRequire, Controller.paypalPayment.bind(Controller))
router.post("/confirm/webhook", Controller.callbackStripe.bind(Controller))
router.post("/filter", UserTokenRequire, Controller.getAllSearch.bind(Controller))
router.post("/filter/meta", UserTokenRequire, Controller.getAllMetaData.bind(Controller))
router.get("/:id", UserTokenRequire, Controller.getById.bind(Controller))
router.delete("/:id", UserTokenRequire, Controller.DeleteOrder.bind(Controller))
router.delete("/Cart/:id", UserTokenRequire, Controller.DeleteCart.bind(Controller))
router.post("/test", Controller.testOrder.bind(Controller))

module.exports = router

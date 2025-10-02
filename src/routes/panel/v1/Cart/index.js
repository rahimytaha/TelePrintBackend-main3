/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/panel/v1/Cart")
const { AdminToken } = require("../../../../middlewares/TokenAuth")

router.get("/status/:statusCode", AdminToken, Controller.getAll.bind(Controller))
router.post("/", AdminToken, Controller.getAllSearch.bind(Controller))
router.post("/Meta", AdminToken, Controller.getAllMetaData.bind(Controller))
router.post("/test", AdminToken, Controller.test.bind(Controller))
router.get("/id/:id", AdminToken, Controller.getById.bind(Controller))
router.put("/:id", AdminToken, Controller.updateStatus.bind(Controller))
router.get("/status", AdminToken, Controller.getAllStatus.bind(Controller))

module.exports = router

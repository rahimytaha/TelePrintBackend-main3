/** @format */

const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/panel/v1/OrderStatus")
const { AdminToken } = require("../../../../middlewares/TokenAuth")

router.post("/firstInitialize", Controller.Initialize.bind(Controller))

router.post("/Initialize", AdminToken, Controller.Initialize.bind(Controller))

router.get("/", AdminToken, Controller.getAll.bind(Controller))
router.get("/id/:id", AdminToken, Controller.getById.bind(Controller))

router.put("/:id", AdminToken, Controller.update.bind(Controller))

router.delete("/:id", AdminToken, Controller.softDelete.bind(Controller))

module.exports = router

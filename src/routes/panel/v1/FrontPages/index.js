// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/panel/v1/FrontPages")
const { AdminToken } = require("../../../../middlewares/TokenAuth")

router.post("/", AdminToken, Controller.create.bind(Controller))

router.get("/", AdminToken, Controller.getAll.bind(Controller))

router.get("/list/get", AdminToken, Controller.pageList.bind(Controller))

router.get("/:id", AdminToken, Controller.getById.bind(Controller))

router.delete("/:id", AdminToken, Controller.deleteFrontPages.bind(Controller))

router.put("/:id", AdminToken, Controller.updateFrontPages.bind(Controller))

module.exports = router

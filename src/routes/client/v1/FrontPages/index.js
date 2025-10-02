// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/client/v1/FrontPages")

router.get("/", Controller.getAll.bind(Controller))

router.get("/:key", Controller.getByKey.bind(Controller))

module.exports = router

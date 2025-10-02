/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/client/v1/Brochure_Material")

router.post("/", Controller.getAll.bind(Controller))

module.exports = router

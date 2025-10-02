/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/client/v1/BlogPost")

router.get("/", Controller.getAll.bind(Controller))
router.get("/:id", Controller.getById.bind(Controller))

module.exports = router

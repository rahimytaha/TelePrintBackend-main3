const express = require("express")
const router = express.Router()
const panel = require("./panel")
const client = require("./client")

// version 1 of app

router.use("/panel", panel)
router.use("/client", client)

module.exports = router

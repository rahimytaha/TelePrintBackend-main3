/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/panel/v1/BlogPic")
const { AdminToken } = require("../../../../middlewares/TokenAuth")
const { uploadBlog } = require("../../../../middlewares/multer")
router.post("/", uploadBlog.single("pic"), AdminToken, Controller.create.bind(Controller))

router.get("/", AdminToken, Controller.getAll.bind(Controller))

router.delete("/", AdminToken, Controller.deletePic.bind(Controller))

module.exports = router

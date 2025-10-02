/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/panel/v1/BlogPost")
const { AdminToken } = require("../../../../middlewares/TokenAuth")
const { uploadBlog } = require("../../../../middlewares/multer")
router.post("/", uploadBlog.single("cover"), AdminToken, Controller.create.bind(Controller))

router.post("/getAll", AdminToken, Controller.getAll.bind(Controller))
router.post("/meta", AdminToken, Controller.getAllMetaData.bind(Controller))
router.get("/:id", AdminToken, Controller.getById.bind(Controller))

router.delete("/:id", AdminToken, Controller.deleteBlogPost.bind(Controller))

router.put("/:id", uploadBlog.single("cover"), AdminToken, Controller.updateBlogPost.bind(Controller))

module.exports = router

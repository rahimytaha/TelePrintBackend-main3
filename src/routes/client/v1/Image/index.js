/** @format */

// => OrderItems
const express = require("express");
const router = express.Router();
const ImageController = require("../../../../controller/client/v1/Image");
const { upload } = require("../../../../middlewares/multer");

router.post("/", upload.array("Images", 6), ImageController.create.bind(ImageController));
router.get("/:parentId", ImageController.getAllByParent.bind(ImageController));

module.exports = router;

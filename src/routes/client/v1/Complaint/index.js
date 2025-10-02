/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/client/v1/Complaint");
const { uploadFile } = require("../../../../middlewares/multer");

router.post(
  "/",
  uploadFile.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 },
  ]),
  Controller.createOrder.bind(Controller)
);

module.exports = router;

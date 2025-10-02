/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/client/v1/Support")
const { UserTokenRequire } = require("../../../../middlewares/TokenAuth")

const { uploadFile } = require("../../../../middlewares/multer")
const multer = require('multer');


const Costumupload = multer({ storage: multer.memoryStorage() });
router.post(
  "/",
  Costumupload.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 }
  ]),
  Controller.createOrder.bind(Controller)
)
router.post("/filter", UserTokenRequire, Controller.getAllSearch.bind(Controller))
router.post("/filter/meta", UserTokenRequire, Controller.getAllMetaData.bind(Controller))
module.exports = router

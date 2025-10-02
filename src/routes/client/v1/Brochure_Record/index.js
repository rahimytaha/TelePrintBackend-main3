/** @format */

// => Customer
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/client/v1/Brochure_Record")
const { uploadFile } = require("../../../../middlewares/multer")
const { UserTokenRequire } = require("../../../../middlewares/TokenAuth")
router.post(
  "/",
  UserTokenRequire,
  uploadFile.fields([
    { name: "file1", maxCount: 1 },
    { name: "file2", maxCount: 1 }
  ]),
  Controller.createOrder.bind(Controller)
)
router.post("/material/umschlag", Controller.getMaterialPriceUmschlag.bind(Controller))
router.post("/material/kern", Controller.getMaterialPriceKern.bind(Controller))

module.exports = router

/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/panel/v1/ConstantShipment");
const { AdminToken } = require("../../../../middlewares/TokenAuth");
const { upload } = require("../../../../middlewares/multer");
router.post("/", upload.single("icon"), AdminToken, Controller.create.bind(Controller));

router.post("/initialize", AdminToken, Controller.initialize.bind(Controller));

router.get("/", AdminToken, Controller.getAll.bind(Controller));
router.get("/:id", AdminToken, Controller.getById.bind(Controller));

router.delete("/:id", AdminToken, Controller.deleteConstantShipment.bind(Controller));

router.put(
  "/:id",
  upload.single("icon"),
  AdminToken,
  Controller.updateConstantShipment.bind(Controller),
);

module.exports = router;

/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/panel/v1/Image");
const { AdminToken } = require("../../../../middlewares/TokenAuth");
const { InputValidation } = require("../../../../util/validation");
const { param, body } = require("express-validator");
const { upload } = require("../../../../middlewares/multer");

router.post("/", upload.array("Images", 6), AdminToken, Controller.create.bind(Controller));

router.get(
  "/",

  AdminToken,
  Controller.getAll.bind(Controller),
);

router.get(
  "/unsubmited",

  AdminToken,
  Controller.getAllUploaded.bind(Controller),
);
router.get(
  "/:id",
  InputValidation([param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید.")]),
  AdminToken,
  Controller.getById.bind(Controller),
);

router.delete(
  "/:id",
  InputValidation([param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید.")]),
  AdminToken,
  Controller.deleteImage.bind(Controller),
);

router.put("/", AdminToken, Controller.updateImage.bind(Controller));
module.exports = router;

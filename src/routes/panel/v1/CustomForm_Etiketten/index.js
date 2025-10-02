/** @format */

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/panel/v1/CustomForm_Etiketten");
const { AdminToken } = require("../../../../middlewares/TokenAuth");
const { InputValidation } = require("../../../../util/validation");
const { param, body } = require("express-validator");

router.post("/initialize", AdminToken, Controller.initialize.bind(Controller));

router.post("/", AdminToken, Controller.create.bind(Controller));

router.get("/", AdminToken, Controller.getAll.bind(Controller));
router.get(
  "/:id",
  InputValidation([param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید.")]),
  AdminToken,
  Controller.getById.bind(Controller)
);

router.delete(
  "/:id",
  InputValidation([param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید.")]),
  AdminToken,
  Controller.deleteCustomForm.bind(Controller)
);

router.put(
  "/:id",
  InputValidation([param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید.")]),
  AdminToken,
  Controller.deleteCustomForm.bind(Controller)
);

module.exports = router;

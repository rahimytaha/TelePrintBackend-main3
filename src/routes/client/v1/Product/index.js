// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/client/v1/Product");
const { InputValidation } = require("../../../../util/validation");
const { param, body } = require("express-validator");

router.get(
  "/",

  Controller.getAll.bind(Controller)
);

router.post("/filter", Controller.getAllByQuery.bind(Controller));

router.get(
  "/:id",
  InputValidation([
    param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید."),
  ]),
  Controller.getById.bind(Controller)
);

module.exports = router;

// => Customer
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/client/v1/Category");
const { InputValidation } = require("../../../../util/validation");
const { param } = require("express-validator");

router.get("/", Controller.getAll.bind(Controller));

router.get("/tree", Controller.getTree.bind(Controller));

router.get("/parent/:parentId", Controller.getByParentId.bind(Controller));

router.get(
  "/:id",
  InputValidation([
    param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید."),
  ]),
  Controller.getById.bind(Controller)
);

module.exports = router;

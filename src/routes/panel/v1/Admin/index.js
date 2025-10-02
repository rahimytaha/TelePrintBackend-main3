// => Admin
const express = require("express");
const router = express.Router();
const AdminController = require("../../../../controller/panel/v1/Admin");
const { AdminToken } = require("../../../../middlewares/TokenAuth");
const { InputValidation } = require("../../../../util/validation");
const { body, param, query, header } = require("express-validator");

router.post(
  "/firstAdmin",
  InputValidation([
    body("userName").notEmpty().withMessage("نام کاربری لازم است"),
    body("password").notEmpty().withMessage("پسورد لازم است"),
  ]),
  AdminController.createFirstAdmin.bind(AdminController)
);

router.post(
  "/",
  InputValidation([
    body("userName").notEmpty().withMessage("نام کاربری لازم است"),
    body("password").notEmpty().withMessage("پسورد لازم است"),
  ]),
  AdminToken,
  AdminController.create.bind(AdminController)
);
router.post(
  "/login",
  InputValidation([
    body("userName").notEmpty().withMessage("نام کاربری لازم است"),
    body("password").notEmpty().withMessage("پسورد لازم است"),
  ]),
  AdminController.login.bind(AdminController)
);
router.get(
  "/",

  AdminToken,
  AdminController.getAllAdmins.bind(AdminController)
);
router.get(
  "/:id",
  InputValidation([
    param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید."),
  ]),
  AdminToken,
  AdminController.getAdminById.bind(AdminController)
);

router.delete(
  "/:id",
  InputValidation([
    param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید."),
  ]),
  AdminToken,
  AdminController.deleteAdmin.bind(AdminController)
);

router.put(
  "/:id",
  InputValidation([
    param("id").notEmpty().withMessage("حتماً باید یک شناسه وارد کنید."),
  ]),
  AdminToken,
  AdminController.updateAdmin.bind(AdminController)
);

router.put("/", AdminToken, AdminController.updateMe.bind(AdminController));

module.exports = router;

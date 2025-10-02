/** @format */

// => Address
const express = require("express");
const router = express.Router();
const Controller = require("../../../../controller/client/v1/Address");
const { UserTokenRequire } = require("../../../../middlewares/TokenAuth");

router.post("/", UserTokenRequire, Controller.create.bind(Controller));

router.get("/", UserTokenRequire, Controller.getAll.bind(Controller));

router.put("/:id", UserTokenRequire, Controller.update.bind(Controller));

router.delete("/:id", UserTokenRequire, Controller.delete.bind(Controller));
module.exports = router;

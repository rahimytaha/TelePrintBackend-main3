/** @format */

// => Address
const express = require("express")
const router = express.Router()
const Controller = require("../../../../controller/client/v1/User")
const { UserTokenRequire } = require("../../../../middlewares/TokenAuth")

router.post("/checkEmail", Controller.checkEmail.bind(Controller))
router.post("/checkEmailLogin", Controller.checkEmailLogin.bind(Controller))

router.post("/confirm", Controller.EmailConfirm.bind(Controller))

router.post("/register", Controller.create.bind(Controller))

router.post("/login", Controller.Login.bind(Controller))

router.get("/", UserTokenRequire, Controller.getMe.bind(Controller))
router.put("/", UserTokenRequire, Controller.update.bind(Controller))

module.exports = router

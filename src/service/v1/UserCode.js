/** @format */

const BaseService = require("../baseService")
const UserService = require("./User")
const Model = require("../../model/v1/UserCode")
const { sendSimpleEmail } = require("../../util/nodeMailer")
module.exports = new (class ServiceModel extends BaseService {
  async findValidCode(email, codeNumber) {
    try {
      const code = await this.findOneByCondition({
        email: email,
        code: codeNumber ? codeNumber : { $ne: -1 }
      })
      if (!code) {
        return { hasError: true, code: "" }
      }
      return code
    } catch (error) {
      console.error(error)
      return { hasError: true }
    }
  }

  async createCode(email, res) {
    try {
      const foundCode = await this.findValidCode(email)

      const randomNumber = Math.floor(Math.random() * 8999) + 1000
      const Object = {
        code: randomNumber,
        email: email
      }
      let code = ""
      if (foundCode.hasError) {
        code = await this.createObject(Object)
      }
      const checkValidDate = new Date(foundCode.updatedAt).getTime()

      if (checkValidDate + 1000 * 300 >= Date.now()) {
        res.status(226).json({
          message: "Sie haben den Code bereits erhalten"
        })
        return { hasError: true }
      } else {
        code = await this.update({ email: email }, { code: randomNumber }, true)
      }

      if (code) {
        await sendSimpleEmail(email, "verifizieren", String(randomNumber), res)
      } else {
        return res.status(500).json({
          message: "مشکلی در ثبت در کد در دیتابیس به وجود آمده است"
        })
      }
    } catch (error) {
      console.log("error createCode 68", error)
      return { hasError: true }
    }
  }

  async createCodeLogin(email, res) {
    try {
      const existUser = await UserService.findOneByCondition({ email: email })
      if (existUser) {
        res.status(240).json({
          message: "Diese E-Mail-Adresse wurde bereits registriert."
        })
        return { hasError: true }
      }
      const foundCode = await this.findValidCode(email)
      const randomNumber = Math.floor(Math.random() * 8999) + 1000
      const Object = {
        code: randomNumber,
        email: email
      }
      let code = ""
      if (foundCode.hasError) {
        code = await this.createObject(Object)
      }
      const checkValidDate = new Date(foundCode.updatedAt).getTime()

      if (checkValidDate + 1000 * 300 >= Date.now()) {
        res.status(226).json({
          message: "Sie haben den Code bereits erhalten"
        })
        return { hasError: true }
      } else {
        code = await this.update({ email: email }, { code: randomNumber }, true)
      }

      if (code) {
        await sendSimpleEmail(email, "verifizieren", String(randomNumber), res)
      } else {
        return res.status(500).json({
          message: "مشکلی در ثبت در کد در دیتابیس به وجود آمده است"
        })
      }
    } catch (error) {
      console.log("error createCode 68", error)
      return { hasError: true }
    }
  }

  async findisok(email, codeNumber, res) {
    try {
      const code = await this.findOneByCondition({
        email: email,
        code: codeNumber ? codeNumber : { $ne: -1 }
      })

      if (!code) {
        res.status(400).json({
          message: "شما چنین کدی  دریافت نکرده اید"
        })
        return { hasError: true, code: "" }
      }

      const checkValidDate = new Date(code.updatedAt).getTime()

      if (checkValidDate + 1000 * 300 < Date.now()) {
        res.status(400).json({
          message: "کد منقضی شده است"
        })
        return { hasError: true }
      }
      await this.update(
        {
          email: email
        },
        { isConfirmed: true }
      )
      return { hasError: false, code: "" }
    } catch (error) {
      console.error(error)
      return { hasError: true }
    }
  }
})(Model)

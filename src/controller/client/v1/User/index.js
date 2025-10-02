/** @format */

const UserService = require("../../../../service/v1/User")
const UserView = require("../../../../view/client/v1/User")
const { GeneralFront } = require("../../../../log")
const UserCodeService = require("../../../../service/v1/UserCode")
module.exports = new (class UserController {
  async checkEmail(req, res) {
    try {
      const { email } = req.body

      //! check if user has been requsted before
      await UserCodeService.createCode(email, res)
      return
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt "
      })
    }
  }

  async checkEmailLogin(req, res) {
    try {
      const { email } = req.body

      //! check if user has been requsted before
      await UserCodeService.createCodeLogin(email, res)

      return
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt "
      })
    }
  }

  async EmailConfirm(req, res) {
    const { email, verifyCode } = req.body
    try {
     
      const existedCode = await UserCodeService.findisok(email, verifyCode, res)

      if (existedCode.hasError) {
        return
      }

      return res.status(200).json({
        message: "Deine Email wurde verifiziert"
      })
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "مشکلی پیش آمده است"
      })
    }
  }

  async create(req, res) {
    try {
      const {
        phoneNumber,
        email,
        customertype,
        firstName,
        lastName,
        postalCode,
        country,
        gender,
        company,
        industry,
        UID_Nummer,
        Association,
        AssociationNumber,
        chairman,
        address,
        city,
        password,
        repeatedPassword
      } = req.body

      const existUser = await UserService.findOneByCondition({
        email: email
      })
      if (existUser) {
        return res.status(400).json({ message: "Diese E-Mail-Adresse existiert bereits." })
      }
      const ConfirmedEmail = await await UserCodeService.findOneByCondition({
        email: email,
        isConfirmed: true
      })
      if (!ConfirmedEmail) {
        return res.status(400).json({ message: "Diese E-Mail-Adresse muss verifiziert werden." })
      }
      if (String(repeatedPassword) !== String(password)) {
        return res.status(400).json({ message: "Ihre Passwörter stimmen nicht überein." })
      }

      const object = {
        phoneNumber,
        email,
        customertype,
        firstName,
        lastName,
        address,
        city,
        postalCode,
        country: customertype === "Partner" ? "Österreich" : country,
        gender,
        company: customertype === "Busineskunde" || customertype === "Partner" ? company : "",
        industry: customertype === "Busineskunde" || customertype === "Partner" ? industry : "",
        UID_Nummer: customertype === "Busineskunde" || customertype === "Partner" ? UID_Nummer : "",
        Association: customertype === "Verband,Verein" ? Association : "",
        AssociationNumber: customertype === "Verband,Verein" ? AssociationNumber : "",
        chairman: customertype === "Verband,Verein" ? chairman : "",
        password
      }
      const createUser = await UserService.createObject(object)

      if (createUser) {
        return res.status(201).json({
          data: UserView.transform(createUser, true),
          message: "کاربر ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "کاربر قابل ثبت نیست."
        })
      }
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async Login(req, res) {
    try {
      const { email, password } = req.body
      const existUser = await UserService.findOneByCondition({
        email: email
      })
      if (!existUser) {
        return res.status(400).json({ message: "Diese E-Mail-Adresse existiert nicht." })
      }
      if (String(existUser.password) !== String(password)) {
        return res.status(400).json({ message: "Dein Passwort ist falsch." })
      }
      return res.status(200).json({
        data: UserView.transform(existUser, true)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async update(req, res) {
    try {
      const {
        customertype,
        firstName,
        lastName,
        postalCode,
        country,
        gender,
        company,
        industry,
        UID_Nummer,
        Association,
        AssociationNumber,
        chairman,
        password,
        address,
        city
      } = req.body

      const object = {
        customertype: customertype ? customertype : req.user.customertype,
        address: address ? address : req.user.address,
        city: city ? city : req.user.city,
        firstName: firstName ? firstName : req.user.firstName,
        lastName: lastName ? lastName : req.user.lastName,
        postalCode: postalCode ? postalCode : req.user.postalCode,
        country: customertype === "Partner" ? "Österreich" : country,
        gender: gender ? gender : req.user.gender,
        company: (customertype === "Busineskunde" || customertype === "Partner") && company ? company : req.user.company,
        industry: (customertype === "Busineskunde" || customertype === "Partner") && industry ? industry : req.user.industry,
        UID_Nummer: (customertype === "Busineskunde" || customertype === "Partner") && UID_Nummer ? UID_Nummer : req.user.UID_Nummer,
        Association: customertype === "Verband,Verein" && Association ? Association : req.user.Association,
        AssociationNumber: customertype === "Verband,Verein" && AssociationNumber ? AssociationNumber : req.user.AssociationNumber,
        chairman: customertype === "Verband,Verein" && chairman ? chairman : req.user.chairman,
        password: password ? password : req.user.password
      }
      const createUser = await UserService.update({ _id: req.user._id }, object, true)

      if (createUser) {
        return res.status(200).json({
          data: UserView.transform(createUser),
          message: "کاربر ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "کاربر قابل ثبت نیست."
        })
      }
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getMe(req, res) {
    try {
      return res.status(200).json({
        data: UserView.transform(req.user, true)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

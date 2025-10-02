const BaseController = require("../../../BaseController")
const AdminService = require("../../../../service/v1/Admin")
const AdminView = require("../../../../view/panel/v1/AdminView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class AdminController extends BaseController {
  async createFirstAdmin(req, res) {
    try {
      const object = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        userName: req.body.userName,
        password: req.body.password,
        isSuperUser: true
      }
      const createAdmin = await AdminService.createFirstAdminService(object)
      if (createAdmin) {
        return res.status(201).json({
          data: AdminView.transform(createAdmin),
          message: "ادمین ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "اولین ادمین قبلاً به ثبت رسیده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async create(req, res) {
    try {
      if (!req.admin.isSuperUser) {
        return res.status(403).json({
          data: "",
          message: "شما ادمین اصلی نیستید"
        })
      }
      const existUserName = await AdminService.findOneByCondition({
        userName: req.body.userName
      })
      if (existUserName) {
        return res.status(400).json({
          data: "",
          message: "این نام کاربری تکراری است"
        })
      }
      const object = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        userName: req.body.userName,
        password: req.body.password,
        isSuperUser: req.body.isSuperUser
      }

      const createAdmin = await AdminService.createObject(object)
      if (createAdmin) {
        return res.status(201).json({
          data: AdminView.transform(createAdmin),
          message: "ادمین ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "ادمین قابل ثبت نیست."
        })
      }
    } catch (err) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async login(req, res) {
    try {
      const admins = await AdminService.findAll({})
      // return res.status(400).json({
      //   data: admins,
      //   message: "رمز عبور اشتباه است."
      // })
      const object = {
        userName: req.body.userName,
        password: req.body.password
      }
      const admin = await AdminService.loginService(object)
      if (admin.success) {
        return res.status(200).json({
          data: AdminView.transform(admin.data, true),
          message: "شما با موفقیت وارد شدید"
        })
      } else if (admin.location === "userName") {
        return res.status(404).json({
          data: {},
          message: "لطفاً به ادمین اصلی اطلاع دهید."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "رمز عبور اشتباه است."
        })
      }
    } catch (err) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getAllAdmins(req, res) {
    try {
      if (!req.admin.isSuperUser) {
        return res.status(403).json({
          data: "",
          message: "شما ادمین اصلی نیستید"
        })
      }
      const admins = await AdminService.findAll({})

      if (admins && admins.length) {
        return res.status(200).json({
          data: AdminView.transformCollection(admins)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "ادمینی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
  async getAdminById(req, res) {
    try {
      if (!req.admin.isSuperUser) {
        return res.status(403).json({
          data: "",
          message: "شما ادمین اصلی نیستید"
        })
      }
      const admin = await AdminService.findOneByCondition({
        _id: req.params.id
      })

      if (admin) {
        return res.status(200).json({
          data: AdminView.transform(admin)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "ادمینی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async deleteAdmin(req, res) {
    try {
      if (!req.admin.isSuperUser) {
        return res.status(403).json({
          data: "",
          message: "شما ادمین اصلی نیستید"
        })
      }
      const deletedAdmin = await AdminService.softDelete({ _id: req.params.id }, req.admin.userName)
      if (deletedAdmin) {
        const deleteAdmin = await AdminView.transform(deletedAdmin)
        return res.status(200).json({
          data: deleteAdmin,
          message: "ادمین مورد نظر حذف شد"
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "ادمین یافت نشد"
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async updateAdmin(req, res) {
    try {
      //! superAdmin checker
      if (!req.admin.isSuperUser) {
        return res.status(403).json({
          data: "",
          message: "شما ادمین اصلی نیستید"
        })
      }
      //! check send Id is true
      const existUser = await AdminService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }
      //! check userName is repeated is true

      const existUserName = await AdminService.findOneByCondition({
        userName: req.body.userName
      })
      if (existUserName && existUser.userName !== existUserName.userName) {
        return res.status(400).json({
          data: "",
          message: "این نام کاربری تکراری است"
        })
      }

      const newAdmin = {
        firstName: req.body.firstName || existUser.firstName,
        lastName: req.body.lastName || existUser.lastName,
        phoneNumber: req.body.phoneNumber || existUser.phoneNumber,
        userName: req.body.userName || existUser.userName,
        password: req.body.password || existUser.password,
        isSuperUser: req.body.isSuperUser || req.body.isSuperUser === false ? req.body.isSuperUser : existUser.isSuperUser
      }

      const updateAdmin = await AdminService.update({ _id: req.params.id }, newAdmin, true)

      if (updateAdmin) {
        return res.status(200).json({
          data: AdminView.transform(updateAdmin),
          message: "ادمین ویرایش شد."
        })
      }
    } catch (error) {
      GeneralPanel.error(error)
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async updateMe(req, res) {
    try {
      const existUserName = await AdminService.findOneByCondition({
        userName: req.body.userName
      })

      if (existUserName && req.admin.userName !== existUserName.userName) {
        return res.status(400).json({
          data: "",
          message: "این نام کاربری تکراری است"
        })
      }
      const newAdmin = {
        firstName: req.body.firstName || existUser.firstName,
        lastName: req.body.lastName || existUser.lastName,
        phoneNumber: req.body.phoneNumber || existUser.phoneNumber,
        userName: req.body.userName || existUser.userName,
        password: req.body.password || existUser.password
      }

      const updateAdmin = await AdminService.update({ _id: req.admin.id }, newAdmin, true)

      if (updateAdmin) {
        return res.status(200).json({
          data: AdminView.transform(updateAdmin),
          message: "ادمین ویرایش شد."
        })
      }
    } catch (error) {
      GeneralPanel.error(error)
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

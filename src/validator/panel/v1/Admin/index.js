const AdminService = require("../../../../service/v1/Admin")

module.exports = new (class AdminController {
  async create(req, res) {
    try {
      if (!req.admin.isSuperUser) {
        res.status(403).json({
          data: "",
          message: "شما ادمین اصلی نیستید"
        })
        return true
      }
      const existUserName = await AdminService.findOneByCondition({
        userName: req.body.userName
      })
      if (existUserName) {
        res.status(400).json({
          data: "",
          message: "این نام کاربری تکراری است"
        })
        return true
      }
    } catch (err) {
      res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
      return true
    }
  }

  async getAllAdmins(req, res) {
    if (!req.admin.isSuperUser) {
      res.status(403).json({
        data: "",
        message: "شما ادمین اصلی نیستید"
      })
      return true
    }
  }
  async getAdminById(req, res) {
    if (!req.admin.isSuperUser) {
      res.status(403).json({
        data: "",
        message: "شما ادمین اصلی نیستید"
      })
      return true
    }
  }

  async deleteAdmin(req, res) {
    if (!req.admin.isSuperUser) {
      res.status(403).json({
        data: "",
        message: "شما ادمین اصلی نیستید"
      })
      return true
    }
    const existUser = await AdminService.findById(req.params.id)

    if (!existUser) {
      res.status(400).json({
        data: "",
        message: "آیدی اشتباه است"
      })
      return true
    }
  }

  async updateAdmin(req, res) {
    if (!req.admin.isSuperUser) {
      res.status(403).json({
        data: "",
        message: "شما ادمین اصلی نیستید"
      })
      return true
    }

    const existUser = await AdminService.findById(req.params.id)

    if (!existUser) {
      res.status(400).json({
        data: "",
        message: "آیدی اشتباه است"
      })
      return true
    }

    const existUserName = await AdminService.findOneByCondition({
      userName: req.body.userName
    })
    if (existUserName && existUser.userName !== existUserName.userName) {
      res.status(400).json({
        data: "",
        message: "این نام کاربری تکراری است"
      })
      return true
    }
  }

  async updateMe(req, res) {
    const existUserName = await AdminService.findOneByCondition({
      userName: req.body.userName
    })

    if (existUserName && req.admin.userName !== existUserName.userName) {
      res.status(400).json({
        data: "",
        message: "این نام کاربری تکراری است"
      })
      return true
    }
  }
})()

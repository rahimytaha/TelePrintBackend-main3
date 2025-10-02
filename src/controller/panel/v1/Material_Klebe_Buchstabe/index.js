/** @format */

const BaseController = require("../../../BaseController")
const Material_Klebe_BuchstabeService = require("../../../../service/v1/Material_Klebe_Buchstabe")
const Material_Klebe_BuchstabeView = require("../../../../view/panel/v1/Material_Klebe_BuchstabeView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Material_Klebe_BuchstabeController extends BaseController {
  async initialize(req, res) {
    try {
      const createMaterial_Klebe_Buchstabe = await Material_Klebe_BuchstabeService.initialize()

      const Material_Klebe_Buchstabes = await Material_Klebe_BuchstabeService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Material_Klebe_BuchstabeView.transformCollection(Material_Klebe_Buchstabes)
      })
    } catch (error) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async create(req, res) {
    try {
      const object = {
        cost: req.body.cost,
        key: req.body.key
      }
      const thisStatus = await Material_Klebe_BuchstabeService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createMaterial_Klebe_Buchstabe = await Material_Klebe_BuchstabeService.createObject(object)

      if (createMaterial_Klebe_Buchstabe) {
        return res.status(201).json({
          data: Material_Klebe_BuchstabeView.transform(createMaterial_Klebe_Buchstabe),
          message: "وضعیت انبار ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "وضعیت انبار قابل ثبت نیست."
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

  async getAll(req, res) {
    try {
      const Material_Klebe_Buchstabes = await Material_Klebe_BuchstabeService.findAllAndPopulateImage({})

      if (Material_Klebe_Buchstabes && Material_Klebe_Buchstabes.length) {
        return res.status(200).json({
          data: Material_Klebe_BuchstabeView.transformCollection(Material_Klebe_Buchstabes)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async getById(req, res) {
    try {
      const Material_Klebe_Buchstabe = await Material_Klebe_BuchstabeService.findOneByCondition({
        _id: req.params.id
      })

      if (Material_Klebe_Buchstabe) {
        return res.status(200).json({
          data: Material_Klebe_BuchstabeView.transform(Material_Klebe_Buchstabe)
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "آیدی اشتباه است"
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async deleteMaterial_Klebe_Buchstabe(req, res) {
    try {
      const deletedMaterial_Klebe_Buchstabe = await Material_Klebe_BuchstabeService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedMaterial_Klebe_Buchstabe) {
        const deleteMaterial_Klebe_Buchstabe = await Material_Klebe_BuchstabeView.transform(deletedMaterial_Klebe_Buchstabe)
        return res.status(200).json({
          data: deleteMaterial_Klebe_Buchstabe,
          message: "وضعیت انبار مورد نظر حذف شد",
          success: true
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "وضعیت انبار یافت نشد",
          success: false
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async updateMaterial_Klebe_Buchstabe(req, res) {
    try {
      //! check send Id is true
      const existUser = await Material_Klebe_BuchstabeService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newMaterial_Klebe_Buchstabe = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updateMaterial_Klebe_Buchstabe = await Material_Klebe_BuchstabeService.update({ _id: req.params.id }, newMaterial_Klebe_Buchstabe, true)

      if (updateMaterial_Klebe_Buchstabe) {
        return res.status(200).json({
          data: Material_Klebe_BuchstabeView.transform(updateMaterial_Klebe_Buchstabe),
          message: "وضعیت انبار ویرایش شد.",
          success: true
        })
      }
    } catch (error) {
      GeneralPanel.error(error)
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }
})()

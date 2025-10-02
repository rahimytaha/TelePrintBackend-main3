/** @format */

const BaseController = require("../../../BaseController")
const Visitenkarte_Standard_EndFormatService = require("../../../../service/v1/Visitenkarte_Standard_EndFormat")
const Visitenkarte_Standard_EndFormatView = require("../../../../view/panel/v1/Visitenkarte_Standard_EndFormatView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Visitenkarte_Standard_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createVisitenkarte_Standard_EndFormat = await Visitenkarte_Standard_EndFormatService.initialize()

      const Visitenkarte_Standard_EndFormats = await Visitenkarte_Standard_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Visitenkarte_Standard_EndFormatView.transformCollection(Visitenkarte_Standard_EndFormats)
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
        key: req.body.key,
        width: req.body.width,
        height: req.body.height
      }
      const thisStatus = await Visitenkarte_Standard_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createVisitenkarte_Standard_EndFormat = await Visitenkarte_Standard_EndFormatService.createObject(object)

      if (createVisitenkarte_Standard_EndFormat) {
        return res.status(201).json({
          data: Visitenkarte_Standard_EndFormatView.transform(createVisitenkarte_Standard_EndFormat),
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
      const Visitenkarte_Standard_EndFormats = await Visitenkarte_Standard_EndFormatService.findAllAndPopulateImage({})

      if (Visitenkarte_Standard_EndFormats && Visitenkarte_Standard_EndFormats.length) {
        return res.status(200).json({
          data: Visitenkarte_Standard_EndFormatView.transformCollection(Visitenkarte_Standard_EndFormats)
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
      const Visitenkarte_Standard_EndFormat = await Visitenkarte_Standard_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (Visitenkarte_Standard_EndFormat) {
        return res.status(200).json({
          data: Visitenkarte_Standard_EndFormatView.transform(Visitenkarte_Standard_EndFormat)
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

  async deleteVisitenkarte_Standard_EndFormat(req, res) {
    try {
      const deletedVisitenkarte_Standard_EndFormat = await Visitenkarte_Standard_EndFormatService.softDelete(
        { _id: req.params.id },
        req.admin.userName
      )

      if (deletedVisitenkarte_Standard_EndFormat) {
        const deleteVisitenkarte_Standard_EndFormat = await Visitenkarte_Standard_EndFormatView.transform(deletedVisitenkarte_Standard_EndFormat)
        return res.status(200).json({
          data: deleteVisitenkarte_Standard_EndFormat,
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

  async updateVisitenkarte_Standard_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await Visitenkarte_Standard_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newVisitenkarte_Standard_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateVisitenkarte_Standard_EndFormat = await Visitenkarte_Standard_EndFormatService.update(
        { _id: req.params.id },
        newVisitenkarte_Standard_EndFormat,
        true
      )

      if (updateVisitenkarte_Standard_EndFormat) {
        return res.status(200).json({
          data: Visitenkarte_Standard_EndFormatView.transform(updateVisitenkarte_Standard_EndFormat),
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

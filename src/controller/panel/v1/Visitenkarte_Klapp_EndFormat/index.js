/** @format */

const BaseController = require("../../../BaseController")
const Visitenkarte_Klapp_EndFormatService = require("../../../../service/v1/Visitenkarte_Klapp_EndFormat")
const Visitenkarte_Klapp_EndFormatView = require("../../../../view/panel/v1/Visitenkarte_Klapp_EndFormatView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Visitenkarte_Klapp_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createVisitenkarte_Klapp_EndFormat = await Visitenkarte_Klapp_EndFormatService.initialize()

      const Visitenkarte_Klapp_EndFormats = await Visitenkarte_Klapp_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Visitenkarte_Klapp_EndFormatView.transformCollection(Visitenkarte_Klapp_EndFormats)
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
      const thisStatus = await Visitenkarte_Klapp_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createVisitenkarte_Klapp_EndFormat = await Visitenkarte_Klapp_EndFormatService.createObject(object)

      if (createVisitenkarte_Klapp_EndFormat) {
        return res.status(201).json({
          data: Visitenkarte_Klapp_EndFormatView.transform(createVisitenkarte_Klapp_EndFormat),
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
      const Visitenkarte_Klapp_EndFormats = await Visitenkarte_Klapp_EndFormatService.findAllAndPopulateImage({})

      if (Visitenkarte_Klapp_EndFormats && Visitenkarte_Klapp_EndFormats.length) {
        return res.status(200).json({
          data: Visitenkarte_Klapp_EndFormatView.transformCollection(Visitenkarte_Klapp_EndFormats)
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
      const Visitenkarte_Klapp_EndFormat = await Visitenkarte_Klapp_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (Visitenkarte_Klapp_EndFormat) {
        return res.status(200).json({
          data: Visitenkarte_Klapp_EndFormatView.transform(Visitenkarte_Klapp_EndFormat)
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

  async deleteVisitenkarte_Klapp_EndFormat(req, res) {
    try {
      const deletedVisitenkarte_Klapp_EndFormat = await Visitenkarte_Klapp_EndFormatService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedVisitenkarte_Klapp_EndFormat) {
        const deleteVisitenkarte_Klapp_EndFormat = await Visitenkarte_Klapp_EndFormatView.transform(deletedVisitenkarte_Klapp_EndFormat)
        return res.status(200).json({
          data: deleteVisitenkarte_Klapp_EndFormat,
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

  async updateVisitenkarte_Klapp_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await Visitenkarte_Klapp_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newVisitenkarte_Klapp_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateVisitenkarte_Klapp_EndFormat = await Visitenkarte_Klapp_EndFormatService.update(
        { _id: req.params.id },
        newVisitenkarte_Klapp_EndFormat,
        true
      )

      if (updateVisitenkarte_Klapp_EndFormat) {
        return res.status(200).json({
          data: Visitenkarte_Klapp_EndFormatView.transform(updateVisitenkarte_Klapp_EndFormat),
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

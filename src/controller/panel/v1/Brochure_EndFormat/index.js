/** @format */

const BaseController = require("../../../BaseController")
const Brochure_EndFormatService = require("../../../../service/v1/Brochure_EndFormat")
const Brochure_EndFormatView = require("../../../../view/panel/v1/Brochure_EndFormatView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Brochure_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createBrochure_EndFormat = await Brochure_EndFormatService.initialize()

      const Brochure_EndFormats = await Brochure_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Brochure_EndFormatView.transformCollection(Brochure_EndFormats)
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
      const thisStatus = await Brochure_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createBrochure_EndFormat = await Brochure_EndFormatService.createObject(object)

      if (createBrochure_EndFormat) {
        return res.status(201).json({
          data: Brochure_EndFormatView.transform(createBrochure_EndFormat),
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
      const Brochure_EndFormats = await Brochure_EndFormatService.findAllAndPopulateImage({})

      if (Brochure_EndFormats && Brochure_EndFormats.length) {
        return res.status(200).json({
          data: Brochure_EndFormatView.transformCollection(Brochure_EndFormats)
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
      const Brochure_EndFormat = await Brochure_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (Brochure_EndFormat) {
        return res.status(200).json({
          data: Brochure_EndFormatView.transform(Brochure_EndFormat)
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

  async deleteBrochure_EndFormat(req, res) {
    try {
      const deletedBrochure_EndFormat = await Brochure_EndFormatService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedBrochure_EndFormat) {
        const deleteBrochure_EndFormat = await Brochure_EndFormatView.transform(deletedBrochure_EndFormat)
        return res.status(200).json({
          data: deleteBrochure_EndFormat,
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

  async updateBrochure_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await Brochure_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newBrochure_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateBrochure_EndFormat = await Brochure_EndFormatService.update({ _id: req.params.id }, newBrochure_EndFormat, true)

      if (updateBrochure_EndFormat) {
        return res.status(200).json({
          data: Brochure_EndFormatView.transform(updateBrochure_EndFormat),
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

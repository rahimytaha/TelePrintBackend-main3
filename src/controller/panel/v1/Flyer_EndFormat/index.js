/** @format */

const BaseController = require("../../../BaseController")
const Flyer_EndFormatService = require("../../../../service/v1/Flyer_EndFormat")
const Flyer_EndFormatView = require("../../../../view/panel/v1/Flyer_EndFormatView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Flyer_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createFlyer_EndFormat = await Flyer_EndFormatService.initialize()

      const Flyer_EndFormats = await Flyer_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Flyer_EndFormatView.transformCollection(Flyer_EndFormats)
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
      const thisStatus = await Flyer_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createFlyer_EndFormat = await Flyer_EndFormatService.createObject(object)

      if (createFlyer_EndFormat) {
        return res.status(201).json({
          data: Flyer_EndFormatView.transform(createFlyer_EndFormat),
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
      const Flyer_EndFormats = await Flyer_EndFormatService.findAllAndPopulateImage({})

      if (Flyer_EndFormats && Flyer_EndFormats.length) {
        return res.status(200).json({
          data: Flyer_EndFormatView.transformCollection(Flyer_EndFormats)
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
      const Flyer_EndFormat = await Flyer_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (Flyer_EndFormat) {
        return res.status(200).json({
          data: Flyer_EndFormatView.transform(Flyer_EndFormat)
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

  async deleteFlyer_EndFormat(req, res) {
    try {
      const deletedFlyer_EndFormat = await Flyer_EndFormatService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedFlyer_EndFormat) {
        const deleteFlyer_EndFormat = await Flyer_EndFormatView.transform(deletedFlyer_EndFormat)
        return res.status(200).json({
          data: deleteFlyer_EndFormat,
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

  async updateFlyer_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await Flyer_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newFlyer_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateFlyer_EndFormat = await Flyer_EndFormatService.update({ _id: req.params.id }, newFlyer_EndFormat, true)

      if (updateFlyer_EndFormat) {
        return res.status(200).json({
          data: Flyer_EndFormatView.transform(updateFlyer_EndFormat),
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

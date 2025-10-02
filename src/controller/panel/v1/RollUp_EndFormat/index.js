/** @format */

const BaseController = require("../../../BaseController")
const RollUp_EndFormatService = require("../../../../service/v1/RollUp_EndFormat")
const RollUp_EndFormatView = require("../../../../view/panel/v1/RollUp_EndFormatView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class RollUp_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createRollUp_EndFormat = await RollUp_EndFormatService.initialize()

      const RollUp_EndFormats = await RollUp_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: RollUp_EndFormatView.transformCollection(RollUp_EndFormats)
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
      const thisStatus = await RollUp_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createRollUp_EndFormat = await RollUp_EndFormatService.createObject(object)

      if (createRollUp_EndFormat) {
        return res.status(201).json({
          data: RollUp_EndFormatView.transform(createRollUp_EndFormat),
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
      const RollUp_EndFormats = await RollUp_EndFormatService.findAllAndPopulateImage({})

      if (RollUp_EndFormats && RollUp_EndFormats.length) {
        return res.status(200).json({
          data: RollUp_EndFormatView.transformCollection(RollUp_EndFormats)
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
      const RollUp_EndFormat = await RollUp_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (RollUp_EndFormat) {
        return res.status(200).json({
          data: RollUp_EndFormatView.transform(RollUp_EndFormat)
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

  async deleteRollUp_EndFormat(req, res) {
    try {
      const deletedRollUp_EndFormat = await RollUp_EndFormatService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedRollUp_EndFormat) {
        const deleteRollUp_EndFormat = await RollUp_EndFormatView.transform(deletedRollUp_EndFormat)
        return res.status(200).json({
          data: deleteRollUp_EndFormat,
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

  async updateRollUp_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await RollUp_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newRollUp_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateRollUp_EndFormat = await RollUp_EndFormatService.update({ _id: req.params.id }, newRollUp_EndFormat, true)

      if (updateRollUp_EndFormat) {
        return res.status(200).json({
          data: RollUp_EndFormatView.transform(updateRollUp_EndFormat),
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

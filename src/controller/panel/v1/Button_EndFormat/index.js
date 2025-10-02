/** @format */

const BaseController = require("../../../BaseController")
const Button_EndFormatService = require("../../../../service/v1/Button_EndFormat")
const Button_EndFormatView = require("../../../../view/panel/v1/Button_EndFormatView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Button_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createButton_EndFormat = await Button_EndFormatService.initialize()

      const Button_EndFormats = await Button_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Button_EndFormatView.transformCollection(Button_EndFormats)
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
      const thisStatus = await Button_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createButton_EndFormat = await Button_EndFormatService.createObject(object)

      if (createButton_EndFormat) {
        return res.status(201).json({
          data: Button_EndFormatView.transform(createButton_EndFormat),
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
      const Button_EndFormats = await Button_EndFormatService.findAllAndPopulateImage({})

      if (Button_EndFormats && Button_EndFormats.length) {
        return res.status(200).json({
          data: Button_EndFormatView.transformCollection(Button_EndFormats)
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
      const Button_EndFormat = await Button_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (Button_EndFormat) {
        return res.status(200).json({
          data: Button_EndFormatView.transform(Button_EndFormat)
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

  async deleteButton_EndFormat(req, res) {
    try {
      const deletedButton_EndFormat = await Button_EndFormatService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedButton_EndFormat) {
        const deleteButton_EndFormat = await Button_EndFormatView.transform(deletedButton_EndFormat)
        return res.status(200).json({
          data: deleteButton_EndFormat,
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

  async updateButton_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await Button_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newButton_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateButton_EndFormat = await Button_EndFormatService.update({ _id: req.params.id }, newButton_EndFormat, true)

      if (updateButton_EndFormat) {
        return res.status(200).json({
          data: Button_EndFormatView.transform(updateButton_EndFormat),
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

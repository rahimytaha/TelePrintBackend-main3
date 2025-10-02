/** @format */

const BaseController = require("../../../BaseController")
const FolderEin_EndFormatService = require("../../../../service/v1/FolderZfalz6Seiten_EndFormat")
const FolderEin_EndFormatView = require("../../../../view/panel/v1/FolderZfalz6Seiten_EndFormatView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class FolderEin_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createFolderEin_EndFormat = await FolderEin_EndFormatService.initialize()

      const FolderEin_EndFormats = await FolderEin_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: FolderEin_EndFormatView.transformCollection(FolderEin_EndFormats)
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
      const thisStatus = await FolderEin_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createFolderEin_EndFormat = await FolderEin_EndFormatService.createObject(object)

      if (createFolderEin_EndFormat) {
        return res.status(201).json({
          data: FolderEin_EndFormatView.transform(createFolderEin_EndFormat),
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
      const FolderEin_EndFormats = await FolderEin_EndFormatService.findAllAndPopulateImage({})

      if (FolderEin_EndFormats && FolderEin_EndFormats.length) {
        return res.status(200).json({
          data: FolderEin_EndFormatView.transformCollection(FolderEin_EndFormats)
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
      const FolderEin_EndFormat = await FolderEin_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (FolderEin_EndFormat) {
        return res.status(200).json({
          data: FolderEin_EndFormatView.transform(FolderEin_EndFormat)
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

  async deleteFolderEin_EndFormat(req, res) {
    try {
      const deletedFolderEin_EndFormat = await FolderEin_EndFormatService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedFolderEin_EndFormat) {
        const deleteFolderEin_EndFormat = await FolderEin_EndFormatView.transform(deletedFolderEin_EndFormat)
        return res.status(200).json({
          data: deleteFolderEin_EndFormat,
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

  async updateFolderEin_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await FolderEin_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newFolderEin_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateFolderEin_EndFormat = await FolderEin_EndFormatService.update({ _id: req.params.id }, newFolderEin_EndFormat, true)

      if (updateFolderEin_EndFormat) {
        return res.status(200).json({
          data: FolderEin_EndFormatView.transform(updateFolderEin_EndFormat),
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

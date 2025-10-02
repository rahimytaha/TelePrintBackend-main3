/** @format */

const BaseController = require("../../../BaseController")
const PrintyDatumstempel_PillowColorsService = require("../../../../service/v1/PrintyDatumstempel_PillowColor")
const PrintyDatumstempel_PillowColorsView = require("../../../../view/panel/v1/PrintyDatumstempel_PillowColor")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class PrintyDatumstempel_PillowColorsController extends BaseController {
  async initialize(req, res) {
    try {
      const createPrintyDatumstempel_PillowColors = await PrintyDatumstempel_PillowColorsService.initialize()

      const PrintyDatumstempel_PillowColorss = await PrintyDatumstempel_PillowColorsService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: PrintyDatumstempel_PillowColorsView.transformCollection(PrintyDatumstempel_PillowColorss)
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
        key: req.body.key,
        CMYK: req.body.CMYK,
        RGB: req.body.RGB
      }
      const thisStatus = await PrintyDatumstempel_PillowColorsService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createPrintyDatumstempel_PillowColors = await PrintyDatumstempel_PillowColorsService.createObject(object)

      if (createPrintyDatumstempel_PillowColors) {
        return res.status(201).json({
          data: PrintyDatumstempel_PillowColorsView.transform(createPrintyDatumstempel_PillowColors),
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
      const PrintyDatumstempel_PillowColorss = await PrintyDatumstempel_PillowColorsService.findAllAndPopulateImage({})

      if (PrintyDatumstempel_PillowColorss && PrintyDatumstempel_PillowColorss.length) {
        return res.status(200).json({
          data: PrintyDatumstempel_PillowColorsView.transformCollection(PrintyDatumstempel_PillowColorss)
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
      const PrintyDatumstempel_PillowColors = await PrintyDatumstempel_PillowColorsService.findOneByCondition({
        _id: req.params.id
      })

      if (PrintyDatumstempel_PillowColors) {
        return res.status(200).json({
          data: PrintyDatumstempel_PillowColorsView.transform(PrintyDatumstempel_PillowColors)
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

  async deletePrintyDatumstempel_PillowColors(req, res) {
    try {
      const deletedPrintyDatumstempel_PillowColors = await PrintyDatumstempel_PillowColorsService.softDelete(
        { _id: req.params.id },
        req.admin.userName
      )

      if (deletedPrintyDatumstempel_PillowColors) {
        const deletePrintyDatumstempel_PillowColors = await PrintyDatumstempel_PillowColorsView.transform(deletedPrintyDatumstempel_PillowColors)
        return res.status(200).json({
          data: deletePrintyDatumstempel_PillowColors,
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

  async updatePrintyDatumstempel_PillowColors(req, res) {
    try {
      //! check send Id is true
      const existUser = await PrintyDatumstempel_PillowColorsService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newPrintyDatumstempel_PillowColors = {
        key: req.body.key || existUser.key,
        CMYK: req.body.CMYK || existUser.CMYK,
        RGB: req.body.RGB || existUser.RGB
      }

      const updatePrintyDatumstempel_PillowColors = await PrintyDatumstempel_PillowColorsService.update(
        { _id: req.params.id },
        newPrintyDatumstempel_PillowColors,
        true
      )

      if (updatePrintyDatumstempel_PillowColors) {
        return res.status(200).json({
          data: PrintyDatumstempel_PillowColorsView.transform(updatePrintyDatumstempel_PillowColors),
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

/** @format */

const BaseController = require("../../../BaseController")
const PrintyDatumstempel_ArtService = require("../../../../service/v1/PrintyDatumstempel_Art")
const PrintyDatumstempel_ArtView = require("../../../../view/panel/v1/PrintyDatumstempel_Art")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class PrintyDatumstempel_ArtController extends BaseController {
  async initialize(req, res) {
    try {
      const createPrintyDatumstempel_Art = await PrintyDatumstempel_ArtService.initialize()

      const PrintyDatumstempel_Arts = await PrintyDatumstempel_ArtService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: PrintyDatumstempel_ArtView.transformCollection(PrintyDatumstempel_Arts)
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
        productKey: req.body.productKey,
        isRound: req.body.isRound,
        completePrice: req.body.completePrice,
        platePrice: req.body.platePrice
      }
      const thisStatus = await PrintyDatumstempel_ArtService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createPrintyDatumstempel_Art = await PrintyDatumstempel_ArtService.createObject(object)

      if (createPrintyDatumstempel_Art) {
        return res.status(201).json({
          data: PrintyDatumstempel_ArtView.transform(createPrintyDatumstempel_Art),
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
      const PrintyDatumstempel_Arts = await PrintyDatumstempel_ArtService.findAllAndPopulateImage({})

      if (PrintyDatumstempel_Arts && PrintyDatumstempel_Arts.length) {
        return res.status(200).json({
          data: PrintyDatumstempel_ArtView.transformCollection(PrintyDatumstempel_Arts)
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
      const PrintyDatumstempel_Art = await PrintyDatumstempel_ArtService.findOneByCondition({
        _id: req.params.id
      })

      if (PrintyDatumstempel_Art) {
        return res.status(200).json({
          data: PrintyDatumstempel_ArtView.transform(PrintyDatumstempel_Art)
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

  async deletePrintyDatumstempel_Art(req, res) {
    try {
      const deletedPrintyDatumstempel_Art = await PrintyDatumstempel_ArtService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedPrintyDatumstempel_Art) {
        const deletePrintyDatumstempel_Art = await PrintyDatumstempel_ArtView.transform(deletedPrintyDatumstempel_Art)
        return res.status(200).json({
          data: deletePrintyDatumstempel_Art,
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

  async updatePrintyDatumstempel_Art(req, res) {
    try {
      //! check send Id is true
      const existUser = await PrintyDatumstempel_ArtService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newPrintyDatumstempel_Art = {
        key: req.body.key || existUser.key,
        productKey: req.body.productKey || existUser.productKey,
        isRound: req.body.isRound || existUser.isRound,
        completePrice: req.body.completePrice || existUser.completePrice,
        platePrice: req.body.platePrice || existUser.platePrice
      }

      const updatePrintyDatumstempel_Art = await PrintyDatumstempel_ArtService.update({ _id: req.params.id }, newPrintyDatumstempel_Art, true)

      if (updatePrintyDatumstempel_Art) {
        return res.status(200).json({
          data: PrintyDatumstempel_ArtView.transform(updatePrintyDatumstempel_Art),
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

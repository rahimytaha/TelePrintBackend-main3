/** @format */

const BaseController = require("../../../BaseController")
const Poster_EndFormatService = require("../../../../service/v1/Poster_EndFormat")
const Poster_EndFormatView = require("../../../../view/panel/v1/Poster_EndFormat")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Poster_EndFormatController extends BaseController {
  async initialize(req, res) {
    try {
      const createPoster_EndFormat = await Poster_EndFormatService.initialize()

      const Poster_EndFormats = await Poster_EndFormatService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Poster_EndFormatView.transformCollection(Poster_EndFormats)
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
      const thisStatus = await Poster_EndFormatService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createPoster_EndFormat = await Poster_EndFormatService.createObject(object)

      if (createPoster_EndFormat) {
        return res.status(201).json({
          data: Poster_EndFormatView.transform(createPoster_EndFormat),
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
      const Poster_EndFormats = await Poster_EndFormatService.findAllAndPopulateImage({})

      if (Poster_EndFormats && Poster_EndFormats.length) {
        return res.status(200).json({
          data: Poster_EndFormatView.transformCollection(Poster_EndFormats)
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
      const Poster_EndFormat = await Poster_EndFormatService.findOneByCondition({
        _id: req.params.id
      })

      if (Poster_EndFormat) {
        return res.status(200).json({
          data: Poster_EndFormatView.transform(Poster_EndFormat)
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

  async deletePoster_EndFormat(req, res) {
    try {
      const deletedPoster_EndFormat = await Poster_EndFormatService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedPoster_EndFormat) {
        const deletePoster_EndFormat = await Poster_EndFormatView.transform(deletedPoster_EndFormat)
        return res.status(200).json({
          data: deletePoster_EndFormat,
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

  async updatePoster_EndFormat(req, res) {
    try {
      //! check send Id is true
      const existUser = await Poster_EndFormatService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newPoster_EndFormat = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updatePoster_EndFormat = await Poster_EndFormatService.update({ _id: req.params.id }, newPoster_EndFormat, true)

      if (updatePoster_EndFormat) {
        return res.status(200).json({
          data: Poster_EndFormatView.transform(updatePoster_EndFormat),
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

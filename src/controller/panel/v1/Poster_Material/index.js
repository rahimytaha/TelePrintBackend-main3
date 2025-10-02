/** @format */

const BaseController = require("../../../BaseController")
const Poster_MaterialService = require("../../../../service/v1/Poster_Material")
const Poster_MaterialView = require("../../../../view/panel/v1/Poster_MaterialView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Poster_MaterialController extends BaseController {
  async initialize(req, res) {
    try {
      const createPoster_Material = await Poster_MaterialService.initialize()

      const Poster_Materials = await Poster_MaterialService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Poster_MaterialView.transformCollection(Poster_Materials)
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
        key: req.body.key
      }
      const thisStatus = await Poster_MaterialService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createPoster_Material = await Poster_MaterialService.createObject(object)

      if (createPoster_Material) {
        return res.status(201).json({
          data: Poster_MaterialView.transform(createPoster_Material),
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
      const Poster_Materials = await Poster_MaterialService.findAllAndPopulateImage({})

      if (Poster_Materials && Poster_Materials.length) {
        return res.status(200).json({
          data: Poster_MaterialView.transformCollection(Poster_Materials)
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
      const Poster_Material = await Poster_MaterialService.findOneByCondition({
        _id: req.params.id
      })

      if (Poster_Material) {
        return res.status(200).json({
          data: Poster_MaterialView.transform(Poster_Material)
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

  async deletePoster_Material(req, res) {
    try {
      const deletedPoster_Material = await Poster_MaterialService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedPoster_Material) {
        const deletePoster_Material = await Poster_MaterialView.transform(deletedPoster_Material)
        return res.status(200).json({
          data: deletePoster_Material,
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

  async updatePoster_Material(req, res) {
    try {
      //! check send Id is true
      const existUser = await Poster_MaterialService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newPoster_Material = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updatePoster_Material = await Poster_MaterialService.update({ _id: req.params.id }, newPoster_Material, true)

      if (updatePoster_Material) {
        return res.status(200).json({
          data: Poster_MaterialView.transform(updatePoster_Material),
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

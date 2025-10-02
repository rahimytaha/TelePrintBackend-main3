/** @format */

const BaseController = require("../../../BaseController")
const Brochure_MaterialService = require("../../../../service/v1/Brochure_Material")
const Brochure_MaterialView = require("../../../../view/panel/v1/Brochure_MaterialView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Brochure_MaterialController extends BaseController {
  async initialize(req, res) {
    try {
      const createBrochure_Material = await Brochure_MaterialService.initialize()

      const Brochure_Materials = await Brochure_MaterialService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Brochure_MaterialView.transformCollection(Brochure_Materials)
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
      const thisStatus = await Brochure_MaterialService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createBrochure_Material = await Brochure_MaterialService.createObject(object)

      if (createBrochure_Material) {
        return res.status(201).json({
          data: Brochure_MaterialView.transform(createBrochure_Material),
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
      const Brochure_Materials = await Brochure_MaterialService.findAllAndPopulateImage({})

      if (Brochure_Materials && Brochure_Materials.length) {
        return res.status(200).json({
          data: Brochure_MaterialView.transformCollection(Brochure_Materials)
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
      const Brochure_Material = await Brochure_MaterialService.findOneByCondition({
        _id: req.params.id
      })

      if (Brochure_Material) {
        return res.status(200).json({
          data: Brochure_MaterialView.transform(Brochure_Material)
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

  async deleteBrochure_Material(req, res) {
    try {
      const deletedBrochure_Material = await Brochure_MaterialService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedBrochure_Material) {
        const deleteBrochure_Material = await Brochure_MaterialView.transform(deletedBrochure_Material)
        return res.status(200).json({
          data: deleteBrochure_Material,
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

  async updateBrochure_Material(req, res) {
    try {
      //! check send Id is true
      const existUser = await Brochure_MaterialService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newBrochure_Material = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updateBrochure_Material = await Brochure_MaterialService.update({ _id: req.params.id }, newBrochure_Material, true)

      if (updateBrochure_Material) {
        return res.status(200).json({
          data: Brochure_MaterialView.transform(updateBrochure_Material),
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

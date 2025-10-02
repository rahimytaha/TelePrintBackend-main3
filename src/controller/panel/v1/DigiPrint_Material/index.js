/** @format */

const BaseController = require("../../../BaseController")
const DigiPrint_MaterialService = require("../../../../service/v1/DigiPrint_Material")
const DigiPrint_MaterialView = require("../../../../view/panel/v1/DigiPrint_MaterialView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class DigiPrint_MaterialController extends BaseController {
  async initialize(req, res) {
    try {
      const createDigiPrint_Material = await DigiPrint_MaterialService.initialize()

      const DigiPrint_Materials = await DigiPrint_MaterialService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: DigiPrint_MaterialView.transformCollection(DigiPrint_Materials)
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
      const thisStatus = await DigiPrint_MaterialService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createDigiPrint_Material = await DigiPrint_MaterialService.createObject(object)

      if (createDigiPrint_Material) {
        return res.status(201).json({
          data: DigiPrint_MaterialView.transform(createDigiPrint_Material),
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
      const DigiPrint_Materials = await DigiPrint_MaterialService.findAllAndPopulateImage({})

      if (DigiPrint_Materials && DigiPrint_Materials.length) {
        return res.status(200).json({
          data: DigiPrint_MaterialView.transformCollection(DigiPrint_Materials)
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
      const DigiPrint_Material = await DigiPrint_MaterialService.findOneByCondition({
        _id: req.params.id
      })

      if (DigiPrint_Material) {
        return res.status(200).json({
          data: DigiPrint_MaterialView.transform(DigiPrint_Material)
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

  async deleteDigiPrint_Material(req, res) {
    try {
      const deletedDigiPrint_Material = await DigiPrint_MaterialService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedDigiPrint_Material) {
        const deleteDigiPrint_Material = await DigiPrint_MaterialView.transform(deletedDigiPrint_Material)
        return res.status(200).json({
          data: deleteDigiPrint_Material,
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

  async updateDigiPrint_Material(req, res) {
    try {
      //! check send Id is true
      const existUser = await DigiPrint_MaterialService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newDigiPrint_Material = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updateDigiPrint_Material = await DigiPrint_MaterialService.update({ _id: req.params.id }, newDigiPrint_Material, true)

      if (updateDigiPrint_Material) {
        return res.status(200).json({
          data: DigiPrint_MaterialView.transform(updateDigiPrint_Material),
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

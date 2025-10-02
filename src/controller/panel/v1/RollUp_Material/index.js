/** @format */

const BaseController = require("../../../BaseController")
const RollUp_MaterialService = require("../../../../service/v1/RollUp_Material")
const RollUp_MaterialView = require("../../../../view/panel/v1/RollUp_MaterialView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class RollUp_MaterialController extends BaseController {
  async initialize(req, res) {
    try {
      const createRollUp_Material = await RollUp_MaterialService.initialize()

      const RollUp_Materials = await RollUp_MaterialService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: RollUp_MaterialView.transformCollection(RollUp_Materials)
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
      const thisStatus = await RollUp_MaterialService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createRollUp_Material = await RollUp_MaterialService.createObject(object)

      if (createRollUp_Material) {
        return res.status(201).json({
          data: RollUp_MaterialView.transform(createRollUp_Material),
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
      const RollUp_Materials = await RollUp_MaterialService.findAllAndPopulateImage({})

      if (RollUp_Materials && RollUp_Materials.length) {
        return res.status(200).json({
          data: RollUp_MaterialView.transformCollection(RollUp_Materials)
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
      const RollUp_Material = await RollUp_MaterialService.findOneByCondition({
        _id: req.params.id
      })

      if (RollUp_Material) {
        return res.status(200).json({
          data: RollUp_MaterialView.transform(RollUp_Material)
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

  async deleteRollUp_Material(req, res) {
    try {
      const deletedRollUp_Material = await RollUp_MaterialService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedRollUp_Material) {
        const deleteRollUp_Material = await RollUp_MaterialView.transform(deletedRollUp_Material)
        return res.status(200).json({
          data: deleteRollUp_Material,
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

  async updateRollUp_Material(req, res) {
    try {
      //! check send Id is true
      const existUser = await RollUp_MaterialService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newRollUp_Material = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updateRollUp_Material = await RollUp_MaterialService.update({ _id: req.params.id }, newRollUp_Material, true)

      if (updateRollUp_Material) {
        return res.status(200).json({
          data: RollUp_MaterialView.transform(updateRollUp_Material),
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

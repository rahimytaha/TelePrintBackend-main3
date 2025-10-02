/** @format */

const BaseController = require("../../../BaseController")
const Material_EtikettenService = require("../../../../service/v1/Material_Etiketten")
const Material_EtikettenView = require("../../../../view/panel/v1/Material_EtikettenView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Material_EtikettenController extends BaseController {
  async initialize(req, res) {
    try {
      const createMaterial_Etiketten = await Material_EtikettenService.initialize()

      const Material_Etikettens = await Material_EtikettenService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Material_EtikettenView.transformCollection(Material_Etikettens)
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
      const thisStatus = await Material_EtikettenService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createMaterial_Etiketten = await Material_EtikettenService.createObject(object)

      if (createMaterial_Etiketten) {
        return res.status(201).json({
          data: Material_EtikettenView.transform(createMaterial_Etiketten),
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
      const Material_Etikettens = await Material_EtikettenService.findAllAndPopulateImage({})

      if (Material_Etikettens && Material_Etikettens.length) {
        return res.status(200).json({
          data: Material_EtikettenView.transformCollection(Material_Etikettens)
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
      const Material_Etiketten = await Material_EtikettenService.findOneByCondition({
        _id: req.params.id
      })

      if (Material_Etiketten) {
        return res.status(200).json({
          data: Material_EtikettenView.transform(Material_Etiketten)
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

  async deleteMaterial_Etiketten(req, res) {
    try {
      const deletedMaterial_Etiketten = await Material_EtikettenService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedMaterial_Etiketten) {
        const deleteMaterial_Etiketten = await Material_EtikettenView.transform(deletedMaterial_Etiketten)
        return res.status(200).json({
          data: deleteMaterial_Etiketten,
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

  async updateMaterial_Etiketten(req, res) {
    try {
      //! check send Id is true
      const existUser = await Material_EtikettenService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newMaterial_Etiketten = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updateMaterial_Etiketten = await Material_EtikettenService.update({ _id: req.params.id }, newMaterial_Etiketten, true)

      if (updateMaterial_Etiketten) {
        return res.status(200).json({
          data: Material_EtikettenView.transform(updateMaterial_Etiketten),
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

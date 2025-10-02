/** @format */

const BaseController = require("../../../BaseController")
const Shape_EtikettenService = require("../../../../service/v1/Shape_Etiketten")
const Shape_EtikettenView = require("../../../../view/panel/v1/Shape_EtikettenView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Shape_EtikettenController extends BaseController {
  async initialize(req, res) {
    try {
      const createShape_Etiketten = await Shape_EtikettenService.initialize()

      const Shape_Etikettens = await Shape_EtikettenService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: Shape_EtikettenView.transformCollection(Shape_Etikettens)
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
      const thisStatus = await Shape_EtikettenService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createShape_Etiketten = await Shape_EtikettenService.createObject(object)

      if (createShape_Etiketten) {
        return res.status(201).json({
          data: Shape_EtikettenView.transform(createShape_Etiketten),
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
      const Shape_Etikettens = await Shape_EtikettenService.findAllAndPopulateImage({})

      if (Shape_Etikettens && Shape_Etikettens.length) {
        return res.status(200).json({
          data: Shape_EtikettenView.transformCollection(Shape_Etikettens)
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
      const Shape_Etiketten = await Shape_EtikettenService.findOneByCondition({
        _id: req.params.id
      })

      if (Shape_Etiketten) {
        return res.status(200).json({
          data: Shape_EtikettenView.transform(Shape_Etiketten)
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

  async deleteShape_Etiketten(req, res) {
    try {
      const deletedShape_Etiketten = await Shape_EtikettenService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedShape_Etiketten) {
        const deleteShape_Etiketten = await Shape_EtikettenView.transform(deletedShape_Etiketten)
        return res.status(200).json({
          data: deleteShape_Etiketten,
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

  async updateShape_Etiketten(req, res) {
    try {
      //! check send Id is true
      const existUser = await Shape_EtikettenService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newShape_Etiketten = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updateShape_Etiketten = await Shape_EtikettenService.update({ _id: req.params.id }, newShape_Etiketten, true)

      if (updateShape_Etiketten) {
        return res.status(200).json({
          data: Shape_EtikettenView.transform(updateShape_Etiketten),
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

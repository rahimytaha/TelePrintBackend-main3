/** @format */

const BaseController = require("../../../BaseController")
const EndFormat_EtikettenService = require("../../../../service/v1/EndFormat_Etiketten")
const EndFormat_EtikettenView = require("../../../../view/panel/v1/EndFormat_EtikettenView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class EndFormat_EtikettenController extends BaseController {
  async initialize(req, res) {
    try {
      const createEndFormat_Etiketten = await EndFormat_EtikettenService.initialize()

      const EndFormat_Etikettens = await EndFormat_EtikettenService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: EndFormat_EtikettenView.transformCollection(EndFormat_Etikettens)
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
      const thisStatus = await EndFormat_EtikettenService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createEndFormat_Etiketten = await EndFormat_EtikettenService.createObject(object)

      if (createEndFormat_Etiketten) {
        return res.status(201).json({
          data: EndFormat_EtikettenView.transform(createEndFormat_Etiketten),
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
      const EndFormat_Etikettens = await EndFormat_EtikettenService.findAllAndPopulateImage({})

      if (EndFormat_Etikettens && EndFormat_Etikettens.length) {
        return res.status(200).json({
          data: EndFormat_EtikettenView.transformCollection(EndFormat_Etikettens)
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
      const EndFormat_Etiketten = await EndFormat_EtikettenService.findOneByCondition({
        _id: req.params.id
      })

      if (EndFormat_Etiketten) {
        return res.status(200).json({
          data: EndFormat_EtikettenView.transform(EndFormat_Etiketten)
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

  async deleteEndFormat_Etiketten(req, res) {
    try {
      const deletedEndFormat_Etiketten = await EndFormat_EtikettenService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedEndFormat_Etiketten) {
        const deleteEndFormat_Etiketten = await EndFormat_EtikettenView.transform(deletedEndFormat_Etiketten)
        return res.status(200).json({
          data: deleteEndFormat_Etiketten,
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

  async updateEndFormat_Etiketten(req, res) {
    try {
      //! check send Id is true
      const existUser = await EndFormat_EtikettenService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newEndFormat_Etiketten = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key,
        width: req.body.width || existUser.width,
        height: req.body.height || existUser.height
      }

      const updateEndFormat_Etiketten = await EndFormat_EtikettenService.update({ _id: req.params.id }, newEndFormat_Etiketten, true)

      if (updateEndFormat_Etiketten) {
        return res.status(200).json({
          data: EndFormat_EtikettenView.transform(updateEndFormat_Etiketten),
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

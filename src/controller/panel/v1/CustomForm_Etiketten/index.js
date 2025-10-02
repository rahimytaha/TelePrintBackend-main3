/** @format */

const BaseController = require("../../../BaseController")
const CustomFormService = require("../../../../service/v1/CustomForm_Etiketten")
const CustomFormView = require("../../../../view/panel/v1/CustomForm_EtikettenView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class CustomFormController extends BaseController {
  async initialize(req, res) {
    try {
      const createCustomForm = await CustomFormService.initialize()

      const CustomForms = await CustomFormService.findAllAndPopulateImage({})
      return res.status(200).json({
        data: CustomFormView.transformCollection(CustomForms)
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
      const thisStatus = await CustomFormService.findOneByCondition(object)
      if (thisStatus) {
        return res.status(400).json({
          data: {},
          message: "قبلا ثبت شده است"
        })
      }
      const createCustomForm = await CustomFormService.createObject(object)

      if (createCustomForm) {
        return res.status(201).json({
          data: CustomFormView.transform(createCustomForm),
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
      const CustomForms = await CustomFormService.findAllAndPopulateImage({})

      if (CustomForms && CustomForms.length) {
        return res.status(200).json({
          data: CustomFormView.transformCollection(CustomForms)
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
      const CustomForm = await CustomFormService.findOneByCondition({
        _id: req.params.id
      })

      if (CustomForm) {
        return res.status(200).json({
          data: CustomFormView.transform(CustomForm)
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

  async deleteCustomForm(req, res) {
    try {
      const deletedCustomForm = await CustomFormService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedCustomForm) {
        const deleteCustomForm = await CustomFormView.transform(deletedCustomForm)
        return res.status(200).json({
          data: deleteCustomForm,
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

  async updateCustomForm(req, res) {
    try {
      //! check send Id is true
      const existUser = await CustomFormService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newCustomForm = {
        cost: req.body.cost || existUser.cost,
        key: req.body.key || existUser.key
      }

      const updateCustomForm = await CustomFormService.update({ _id: req.params.id }, newCustomForm, true)

      if (updateCustomForm) {
        return res.status(200).json({
          data: CustomFormView.transform(updateCustomForm),
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

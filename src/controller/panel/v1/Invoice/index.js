/** @format */

const BaseController = require("../../../BaseController")
const InvoiceService = require("../../../../service/v1/Invoice")
const OrderService = require("../../../../service/v1/Order")
const InvoiceView = require("../../../../view/panel/v1/InvoiceView")
const { GeneralPanel } = require("../../../../log")
const { sendMail } = require("../../../../util/nodeMailer")

module.exports = new (class InvoiceController extends BaseController {
  async getAll(req, res) {
    try {
      const Invoices = await InvoiceService.findAllAndPopulate(
        {},
        { path: "orderIds", populate: { path: "tableId", populate: { path: "materialId" } } }
      )
      if (Invoices && Invoices.length) {
        return res.status(200).json({
          data: Invoices
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
      const Flyer_EndFormat = await InvoiceService.findOneByCondition({
        _id: req.params.id
      })

      if (Flyer_EndFormat) {
        return res.status(200).json({
          data: InvoiceView.transform(Flyer_EndFormat)
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

  async updateStatus(req, res) {
    try {
      const thisInvoice = await InvoiceService.findOneByCondition({
        _id: req.params.id
      })

      if (!thisInvoice) {
        return res.status(400).json({
          data: {},
          message: "آیدی اشتباه است"
        })
      }

      const orderIds = await OrderService.updateAll({ _id: thisInvoice.orderIds }, { statusName: req.body.status })
      return res.status(200).json({
        data: InvoiceView.transform(thisInvoice)
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async getAllStatus(req, res) {
    try {
      return res.status(200).json({
        data: ["not_submitted", "submitted", "compelete", "payment_processing"]
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async test(req, res) {
    try {
      const generatedInvoiceNumber = await InvoiceService.CreateInovice(req.body.orderItems, req.body.total)

      if (!generatedInvoiceNumber) {
        return res.status(400).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }
      return res.status(200).json({
        data: InvoiceView.transform(generatedInvoiceNumber)
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }
})()

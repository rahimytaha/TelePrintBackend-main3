/** @format */

const BaseController = require("../../../BaseController")
const ConstantShipmentService = require("../../../../service/v1/ConstantShipment")
const ConstantShipmentView = require("../../../../view/client/v1/ConstantShipmentView")
const InvoiceService = require("../../../../service/v1/Invoice")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class ConstantShipmentController extends BaseController {
  async getAll(req, res) {
    try {
      const ConstantShipments = await ConstantShipmentService.findAllAndPopulate({})
      if (ConstantShipments && ConstantShipments.length) {
        return res.status(200).json({
          data: ConstantShipmentView.transformCollection(ConstantShipments)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "شیوه ارسالی ثبت نشده است."
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

  async getById(req, res) {
    try {
      const ConstantShipment = await ConstantShipmentService.findOneByCondition({
        _id: req.params.id
      })

      if (ConstantShipment) {
        return res.status(200).json({
          data: ConstantShipmentView.transform(ConstantShipment)
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
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

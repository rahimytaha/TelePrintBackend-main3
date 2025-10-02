/** @format */

const BaseController = require("../../../BaseController")
const TestRecordService = require("../../../../service/v1/TestRecord")
const OrderService = require("../../../../service/v1/Order")
const TestRecordView = require("../../../../view/client/v1/TestRecord")

const { GeneralFront } = require("../../../../log")

module.exports = new (class TestRecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const Object = {
        finalPrice: 1,
        phoneNumber: req.body.phoneNumber
      }
      const CreatedFlyerOrder = await TestRecordService.createObject(Object)
      if (!CreatedFlyerOrder) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }
      await OrderService.createObject({
        tableName: "TestRecord",
        tableId: CreatedFlyerOrder._id,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        productName: "Test",
        statusName: "not_submitted",
        description: req.body.description,
        customertype: req.body.customertype,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        postalCode: req.body.postalCode,
        country: req.body.customertype === "Partner" ? "Österreich" : req.body.country,
        gender: req.body.gender,
        company: req.body.customertype === "Busineskunde" || req.body.customertype === "Partner" ? req.body.company : "",
        industry: req.body.customertype === "Busineskunde" || req.body.customertype === "Partner" ? req.body.industry : "",
        UID_Nummer: req.body.customertype === "Busineskunde" || req.body.customertype === "Partner" ? req.body.UID_Nummer : "",
        Association: req.body.customertype === "Verband,Verein" ? req.body.Association : "",
        AssociationNumber: req.body.customertype === "Verband,Verein" ? req.body.AssociationNumber : "",
        chairman: req.body.customertype === "Verband,Verein" ? req.body.chairman : "",
        address: req.body.address,
        street: req.body.street,
        shipment: req.body.shipment
      })
      return res.status(200).json({
        data: TestRecordView.transform(CreatedFlyerOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

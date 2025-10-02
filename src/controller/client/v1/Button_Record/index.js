/** @format */

const BaseController = require("../../../BaseController")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const Button_RecordService = require("../../../../service/v1/Button_Record")
const OrderService = require("../../../../service/v1/Order")
const CartService = require("../../../../service/v1/Cart")
const Button_RecordView = require("../../../../view/client/v1/Button_RecordView")

const { GeneralFront } = require("../../../../log")

module.exports = new (class Button_RecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const Price = await Button_RecordService.calculatorPrice(req)
      if (Price.hasError) {
        return res.status(400).json({
          data: "",
          message:
            "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
        })
      }
      const Object = {
        count: req.body.count,
        width: req.body.width,
        height: req.body.height,
        finalPrice: Price,
        description: req.body.description,
        priceWithOutTax: Price * 0.8,
        Tax: Price * 0.2,
        file1: req.files && req.files.file1 && req.files.file1[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file1[0].filename : "",
        file2: req.files && req.files.file2 && req.files.file2[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file2[0].filename : ""
      }
      const CreatedFlyerOrder = await Button_RecordService.createObject(Object)
      if (!CreatedFlyerOrder) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }

      const OrderItem = await OrderService.createObject({
        tableName: "Button_Record",
        tableId: CreatedFlyerOrder._id,
        productName: `Button Ø${req.body.width}mm Durchmesser`,
        description: req.body.description
      })

      const CreatedObject = await CartService.createCart(req, OrderItem, Object)

      return res.status(200).json({
        data: Button_RecordView.transform(CreatedFlyerOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
  async calulateOrder(req, res) {
    try {
      const Price = await Button_RecordService.calculatorPrice(req)
      const Object = {
        count: req.body.count,
        width: req.body.width,
        height: req.body.height,
        finalPrice: Price,
        priceWithOutTax: Price * 0.8,
        Tax: Price * 0.2
      }

      return res.status(200).json({
        data: Object
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

/** @format */

const BaseController = require("../../../BaseController")
const PackageService = require("../../../../service/v1/Package")
const OrderService = require("../../../../service/v1/Order")
const FlyerRecordView = require("../../../../view/client/v1/FlyerRecord")
const { GeneralFront, GeneralPanel } = require("../../../../log")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const CartService = require("../../../../service/v1/Cart")
module.exports = new (class FlyerRecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const { type } = req.body
      let recordObject = {}
      let OrderItemRecord = {}
      // type = ["vistCard", "A5", "A6"];
      switch (type) {
        case "vistCard":
          recordObject = {
            count: 100,
            finalPrice: 20,
            priceWithOutTax: 20 * 0.8,
            Tax: 20 * 0.2,
            description: req.body.description,
            file1: req.files && req.files.file1 && req.files.file1[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file1[0].filename}` : "",
            file2: req.files && req.files.file2 && req.files.file2[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file2[0].filename}` : ""
          }
          OrderItemRecord = {
            tableName: "Package",
            productName: `100 Visitenkarte Beidseitig farbe 350g`,
            description: req.body.description
          }
          break

        case "A5":
          recordObject = {
            count: 50,
            finalPrice: 25,
            priceWithOutTax: 25 * 0.8,
            Tax: 25 * 0.2,
            description: req.body.description,
            file1: req.files && req.files.file1 && req.files.file1[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file1[0].filename}` : "",
            file2: req.files && req.files.file2 && req.files.file2[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file2[0].filename}` : ""
          }
          OrderItemRecord = {
            tableName: "Package",
            productName: `50 Flyer A5 Stk. Beidseitig 160g`,
            description: req.body.description
          }
          break
        case "A6":
          recordObject = {
            count: 100,
            finalPrice: 25,
            priceWithOutTax: 25 * 0.8,
            Tax: 25 * 0.2,
            description: req.body.description,
            file1: req.files && req.files.file1 && req.files.file1[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file1[0].filename}` : "",
            file2: req.files && req.files.file2 && req.files.file2[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file2[0].filename}` : ""
          }
          OrderItemRecord = {
            tableName: "Package",
            productName: `100 Flyer A6 Stk. Beidseitig 160g`,
            description: req.body.description
          }
          break
        default:
          break
      }

      const CreatedOrder = await PackageService.createObject(recordObject)
      if (!CreatedOrder) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }
      OrderItemRecord.tableId = CreatedOrder._id
      const OrderItem = await OrderService.createObject(OrderItemRecord)
      const CreatedObject = await CartService.createCart(req, OrderItem, recordObject)
      return res.status(200).json({
        data: FlyerRecordView.transform(CreatedOrder)
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

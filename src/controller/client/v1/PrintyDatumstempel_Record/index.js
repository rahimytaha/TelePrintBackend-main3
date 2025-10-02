/** @format */

const BaseController = require("../../../BaseController")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const PrintyDatumstempel_RecordService = require("../../../../service/v1/PrintyDatumstempel_Record")
const PrintyDatumstempel_Art = require("../../../../service/v1/PrintyDatumstempel_Art")
const PrintyDatumstempel_PillowColorService = require("../../../../service/v1/PrintyDatumstempel_PillowColor")
const OrderService = require("../../../../service/v1/Order")
const PrintyDatumstempel_RecordView = require("../../../../view/client/v1/PrintyDatumstempel_Record")
const PrintyDatumstempel_ArtView = require("../../../../view/client/v1/PrintyDatumstempel_Art")
const CartService = require("../../../../service/v1/Cart")
const { GeneralFront } = require("../../../../log")

module.exports = new (class PrintyDatumstempel_RecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const { count, pillowColorId, isComplete, isRound, artId, email } = req.body
      const ART = await PrintyDatumstempel_Art.findOneByCondition({
        _id: artId
      })
      const PrintyDatumstempel_PillowColor = await PrintyDatumstempel_PillowColorService.findOneByCondition({
        _id: pillowColorId
      })
      const Price = await PrintyDatumstempel_RecordService.calculatorPrice(req, ART)
      const Object = {
        count: count,
        art: ART.productKey,
        isRound: isRound,
        isComplete: isComplete,
        pillowColorId: pillowColorId,
        finalPrice: Price,
        description: req.body.description,
        priceWithOutTax: Price * 0.8,
        Tax: Price * 0.2,
        file1: req.files && req.files.file1 && req.files.file1[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file1[0].filename : "",
        file2: req.files && req.files.file2 && req.files.file2[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file2[0].filename : ""
      }
      const CreatedFlyerOrder = await PrintyDatumstempel_RecordService.createObject(Object)
      if (!CreatedFlyerOrder) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }

      const OrderItem = await OrderService.createObject({
        tableName: "PrintyDatumstempel_Record",
        tableId: CreatedFlyerOrder._id,
        productName: `Professional Datumstempel ${ART.productKey} ${PrintyDatumstempel_PillowColor.key} Rund:${isRound ? "ja" : "nein"} Complete:${
          isComplete ? "ja" : "nein"
        }`,
        description: req.body.description
      })
      const CreatedObject = await CartService.createCart(req, OrderItem, Object)
      return res.status(200).json({
        data: PrintyDatumstempel_RecordView.transform(CreatedFlyerOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getARTPrice(req, res) {
    try {
      const { isRound } = req.body
      const PrintyDatumstempel_Arts = await PrintyDatumstempel_Art.findAllAndPopulateImage({
        isRound: isRound
      })

      if (!PrintyDatumstempel_Arts || !PrintyDatumstempel_Arts.length) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const MatrialWithPrice = await Promise.all(
        PrintyDatumstempel_Arts.map(async (art) => {
          const Price = await PrintyDatumstempel_RecordService.calculatorPrice(req, art)
          return { ...art, price: Price }
        })
      )
      return res.status(200).json({
        data: PrintyDatumstempel_ArtView.transformCollection(MatrialWithPrice)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }
})()

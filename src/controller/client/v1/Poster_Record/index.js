/** @format */

const BaseController = require("../../../BaseController")
const Poster_RecordService = require("../../../../service/v1/Poster_Record")
const Poster_MaterialService = require("../../../../service/v1/Poster_Material")
const OrderService = require("../../../../service/v1/Order")
const Poster_RecordView = require("../../../../view/client/v1/Poster_Record")
const Poster_MaterialView = require("../../../../view/panel/v1/Poster_MaterialView")
const { GeneralFront, GeneralPanel } = require("../../../../log")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const CartService = require("../../../../service/v1/Cart")
module.exports = new (class Poster_RecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const { count, width, height, materialId } = req.body
      const Poster_Materials = await Poster_MaterialService.findOneByCondition({
        _id: materialId
      })
      const Price = Poster_RecordService.calculatorPrice(req, Poster_Materials)
      const Object = {
        count: count,
        description: req.body.description,
        width: width,
        height: height,
        materialId: materialId,
        finalPrice: Price,
        priceWithOutTax: Price * 0.8,
        Tax: Price * 0.2,
        file1: req.files && req.files.file1 && req.files.file1[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file1[0].filename}` : "",
        file2: req.files && req.files.file2 && req.files.file2[0] ? `${BASE_URL_FOR_MULTER}/files/${req.files.file2[0].filename}` : ""
      }
      const CreatedFlyerOrder = await Poster_RecordService.createObject(Object)
      if (!CreatedFlyerOrder) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }

      const OrderItem = await OrderService.createObject({
        tableName: "Poster_Record",
        tableId: CreatedFlyerOrder._id,
        productName: `Plakate ${width}x${height}mm ${Poster_Materials.key}`,
        description: req.body.description
      })
      const CreatedObject = await CartService.createCart(req, OrderItem, Object)
      return res.status(200).json({
        data: Poster_RecordView.transform(CreatedFlyerOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getMaterialPrice(req, res) {
    try {
      const Poster_Materials = await Poster_MaterialService.findAllAndPopulateImage()

      if (!Poster_Materials || !Poster_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const MatrialWithPrice = Poster_Materials.map((Material) => {
        const Price = Poster_RecordService.calculatorPrice(req, Material)

        return { ...Material, price: Price }
      })

      return res.status(200).json({
        data: Poster_MaterialView.transformCollection(MatrialWithPrice)
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

  async TestFormol(req, res) {
    try {
      const Poster_Material = await Poster_MaterialService.findOneByCondition({})

      if (!Poster_Material) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const Price = Poster_RecordService.calculatorPrice(req, Poster_Material)

      return res.status(200).json({
        data: Poster_MaterialView.transform({
          ...Poster_Material._doc,
          price: Price
        })
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

/** @format */

const BaseController = require("../../../BaseController")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const RollUp_RecordService = require("../../../../service/v1/RollUp_Record")
const RollUp_MaterialService = require("../../../../service/v1/RollUp_Material")
const OrderService = require("../../../../service/v1/Order")
const RollUp_RecordView = require("../../../../view/client/v1/RollUp_Record")
const RollUp_MaterialView = require("../../../../view/panel/v1/RollUp_MaterialView")
const CartService = require("../../../../service/v1/Cart")
const { GeneralFront } = require("../../../../log")

module.exports = new (class RollUp_RecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const { count, width, height, materialId } = req.body

      const RollUp_Materials = await RollUp_MaterialService.findOneByCondition({
        _id: materialId
      })
      const Price = await RollUp_RecordService.calculatorPrice(req, RollUp_Materials)
      console.log("Price", Price)
      const Object = {
        count: count,
        width: width,
        height: height,
        materialId: materialId,
        finalPrice: Price,
        priceWithOutTax: Price * 0.8,
        description: req.body.description,
        Tax: Price * 0.2,
        file1: req.files && req.files.file1 && req.files.file1[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file1[0].filename : "",
        file2: req.files && req.files.file2 && req.files.file2[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file2[0].filename : ""
      }
      console.log("Object", Object)

      const CreatedFlyerOrder = await RollUp_RecordService.createObject(Object)
      if (!CreatedFlyerOrder) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }

      const OrderItem = await OrderService.createObject({
        tableName: "RollUp_Record",
        tableId: CreatedFlyerOrder._id,
        productName: `RollUp ${Number(width) / 10}x${Number(height) / 10}cm ${RollUp_Materials.key}`,
        description: req.body.description
      })
      const CreatedObject = await CartService.createCart(req, OrderItem, Object)
      return res.status(200).json({
        data: RollUp_RecordView.transform(CreatedFlyerOrder)
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
      const { isCellophane } = req.body
      const RollUp_Materials = await RollUp_MaterialService.findAllAndPopulateImage({})

      if (!RollUp_Materials || !RollUp_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const MatrialWithPrice = await Promise.all(
        RollUp_Materials.map(async (Material) => {
          const Price = await RollUp_RecordService.calculatorPrice(req, Material)
          return { ...Material, price: Price }
        })
      )
      return res.status(200).json({
        data: RollUp_MaterialView.transformCollection(MatrialWithPrice)
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

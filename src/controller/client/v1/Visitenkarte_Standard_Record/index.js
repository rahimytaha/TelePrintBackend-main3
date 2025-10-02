/** @format */

const BaseController = require("../../../BaseController")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const Visitenkarte_Standard_RecordService = require("../../../../service/v1/Visitenkarte_Standard_Record")
const DigiPrint_MaterialService = require("../../../../service/v1/DigiPrint_Material")
const OrderService = require("../../../../service/v1/Order")
const Visitenkarte_Standard_RecordView = require("../../../../view/client/v1/Visitenkarte_Standard_Record")
const DigiPrint_MaterialView = require("../../../../view/panel/v1/DigiPrint_MaterialView")
const CartService = require("../../../../service/v1/Cart")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Visitenkarte_Standard_RecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const { doubleSided, count, colorful, isCellophane, cellophaneType, width, height, materialId, email } = req.body
      const DigiPrint_Materials = await DigiPrint_MaterialService.findOneByCondition({
        _id: materialId
      })
      const Price = await Visitenkarte_Standard_RecordService.calculatorPrice(req, DigiPrint_Materials)
      const Object = {
        count: count,
        doubleSided: doubleSided,
        colorful: colorful,
        isCellophane: isCellophane,
        cellophaneType: isCellophane ? cellophaneType : "nein",
        width: width,
        height: height,
        materialId: materialId,
        finalPrice: Price,
        priceWithOutTax: Price * 0.8,
        Tax: Price * 0.2,
        description: req.body.description,
        file1: req.files && req.files.file1 && req.files.file1[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file1[0].filename : "",
        file2: req.files && req.files.file2 && req.files.file2[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file2[0].filename : ""
      }
      const CreatedFlyerOrder = await Visitenkarte_Standard_RecordService.createObject(Object)
      if (!CreatedFlyerOrder) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }
      const OrderItem = await OrderService.createObject({
        tableName: "Visitenkarte_Standard_Record",
        tableId: CreatedFlyerOrder._id,
        productName: `Visitenkarte Standard ${width}x${height}mm ${DigiPrint_Materials.key} ${
          String(doubleSided) === "true" ? "beidseitig" : "einseitig"
        } ${String(colorful) === "true" ? "farbig" : "S/W"} ${String(isCellophane) === "true" ? `Zellophan ${cellophaneType}` : ""}`,
        description: req.body.description
      })
      const CreatedObject = await CartService.createCart(req, OrderItem, Object)
      return res.status(200).json({
        data: Visitenkarte_Standard_RecordView.transform(CreatedFlyerOrder)
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
      const DigiPrint_Materials = await DigiPrint_MaterialService.findAllAndPopulateImage({
        isCellophane: true
      })

      if (!DigiPrint_Materials || !DigiPrint_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const MatrialWithPrice = await Promise.all(
        DigiPrint_Materials.map(async (Material) => {
          const Price = await Visitenkarte_Standard_RecordService.calculatorPrice(req, Material)
          return { ...Material, price: Price }
        })
      )
      return res.status(200).json({
        data: DigiPrint_MaterialView.transformCollection(MatrialWithPrice)
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

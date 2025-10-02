/** @format */

const BaseController = require("../../../BaseController")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const Brochure_RecordService = require("../../../../service/v1/Brochure_Record")
const Brochure_MaterialService = require("../../../../service/v1/Brochure_Material")
const Brochure_EndFormatService = require("../../../../service/v1/Brochure_EndFormat")
const OrderService = require("../../../../service/v1/Order")
const Brochure_RecordView = require("../../../../view/client/v1/Brochure_Record")
const Brochure_MaterialView = require("../../../../view/panel/v1/Brochure_MaterialView")
const CartService = require("../../../../service/v1/Cart")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Brochure_RecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const { count, endFormatId, description } = req.body
      let { Umschlag, Kern } = req.body
      const { width, height, _doc } = await Brochure_EndFormatService.findOneByCondition({ _id: endFormatId })
      Umschlag = JSON.parse(Umschlag)
      Kern = JSON.parse(Kern)
      const { isCellophane, cellophaneType, colorful, doubleSided, materialId, pageCount } = Kern

      const [Umschlag_Materials, Kern_Materials] = await Promise.all([
        Brochure_MaterialService.findOneByCondition({
          _id: Umschlag.materialId
        }),
        Brochure_MaterialService.findOneByCondition({
          _id: Kern.materialId
        })
      ])
      const calculateObjectUmschlag = {
        ...Umschlag,
        count: count * (Umschlag.pageCount / 4),
        doubleSided: true,
        width: width,
        height: height
      }
      const calculateObjectKern = {
        ...Kern,
        count: count * (Kern.pageCount / 4),
        doubleSided: true,
        width: width,
        height: height
      }
      const [PriceUmschlag, PriceKern] = await Promise.all([
        Brochure_RecordService.calculatorPrice(calculateObjectUmschlag, Umschlag_Materials),
        Brochure_RecordService.calculatorPrice(calculateObjectKern, Kern_Materials)
      ])

      const Price = PriceUmschlag + PriceKern
      const Object = {
        count: count,
        pages: Kern.pageCount,
        doubleSided: Umschlag.doubleSided,
        kernDoubleSided: Kern.doubleSided,
        kernColorful: Kern.colorful,
        colorful: Umschlag.colorful,
        kernIsCellophane: Kern.isCellophane,
        kernCellophaneType: Kern.cellophaneType,
        isCellophane: Umschlag.isCellophane,
        cellophaneType: Umschlag.cellophaneType,
        width: width,
        height: height,
        description: description,
        materialId: Umschlag.materialId,
        kernMaterialId: Kern.materialId,
        finalPrice: Price,
        priceWithOutTax: Price * 0.8,
        Tax: Price * 0.2,
        file1: req.files && req.files.file1 && req.files.file1[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file1[0].filename : "",
        file2: req.files && req.files.file2 && req.files.file2[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file2[0].filename : ""
      }

      const CreatedFlyerOrder = await Brochure_RecordService.createObject(Object)
      if (!PriceUmschlag) {
        return res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
      }

      const OrderItem = await OrderService.createObject({
        tableName: "Brochure_Record",
        tableId: CreatedFlyerOrder._id,
        productName: `Broschüren ${_doc.key} ${Kern.pageCount} Page Umschlag ${Umschlag_Materials.key} ${
          String(Object.colorful) === "true" ? "farbig" : "S/W"
        } ${String(Object.isCellophane) === "true" ? `Zellophan ${Object.cellophaneType}` : ""}||Kern ${
          String(Object.kernColorful) === "true" ? "farbig" : "S/W"
        } ${String(Object.kernIsCellophane) === "true" ? `Zellophan ${Object.kernCellophaneType}` : ""}`,
        description: req.body.description
      })
      const CreatedObject = await CartService.createCart(req, OrderItem, Object)
      return res.status(200).json({
        data: Brochure_RecordView.transform(CreatedFlyerOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getMaterialPriceUmschlag(req, res) {
    try {
      let { Umschlag, count, endFormatId } = req.body
      const { width, height, ...endFormatObject } = await Brochure_EndFormatService.findOneByCondition({ _id: endFormatId })

      Umschlag = {
        ...Umschlag,
        doubleSided: true,
        count: count * (Umschlag.pageCount / 4),
        width: width,
        height: height
      }

      const Brochure_Materials = await Brochure_MaterialService.findAllAndPopulateImage({
        isCellophane: Umschlag.isCellophane ? Umschlag.isCellophane : { $ne: null }
      })

      if (!Brochure_Materials || !Brochure_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "Zellophanieren ist bei Broschüren nur bis 16 Seiten und ab 160g-Papier möglich."
        })
      }

      const MaterialWithPrice = await Promise.all(
        Brochure_Materials.map(async (Material) => {
          const Price = await Brochure_RecordService.calculatorPrice(Umschlag, Material)
          return { ...Material, price: Price }
        })
      )
      return res.status(200).json({
        data: Brochure_MaterialView.transformCollection(MaterialWithPrice)
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async getMaterialPriceKern(req, res) {
    try {
      let { Kern, count, endFormatId } = req.body
      const { width, height, ...endFormatObject } = await Brochure_EndFormatService.findOneByCondition({ _id: endFormatId })

      Kern = {
        ...Kern,
        count: count * (Kern.pageCount / 4),
        doubleSided: true,
        width: width,
        height: height
      }
      const Brochure_Materials = await Brochure_MaterialService.findAllAndPopulateImage({
        isCellophane: Kern.isCellophane ? Kern.isCellophane : { $ne: null },
        max: { $gte: Kern.pageCount }
      })

      if (!Brochure_Materials || !Brochure_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "Zellophanieren ist bei Broschüren nur bis 16 Seiten und ab 160g-Papier möglich."
        })
      }

      const MaterialWithPrice = await Promise.all(
        Brochure_Materials.map(async (Material) => {
          const Price = await Brochure_RecordService.calculatorPrice(Kern, Material)
          return { ...Material, price: Price }
        })
      )
      return res.status(200).json({
        data: Brochure_MaterialView.transformCollection(MaterialWithPrice)
      })
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }
})()

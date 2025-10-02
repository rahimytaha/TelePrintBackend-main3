/** @format */

const BaseController = require("../../../BaseController")
const Brochure_MaterialService = require("../../../../service/v1/Brochure_Material")
const FlyerRecord = require("../../../../service/v1/FlyerRecord")
const Brochure_MaterialView = require("../../../../view/panel/v1/Brochure_MaterialView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Brochure_MaterialController extends BaseController {
  async getAll(req, res) {
    try {
      const { isCellophane } = req.body
      const Brochure_Materials = await Brochure_MaterialService.findAllAndSort(
        {
          isCellophane: isCellophane ? isCellophane : { $ne: null }
        },
        { sort: 1 }
      )

      if (!Brochure_Materials || !Brochure_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const MatrialWithPrice = await Promise.all(
        Brochure_Materials.map(async (Material) => {
          const Price = await FlyerRecord.calculatorPrice(req, Material)
          return { ...Material, price: Price }
        })
      )
      return res.status(200).json({
        data: Brochure_MaterialView.transformCollection(MatrialWithPrice)
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

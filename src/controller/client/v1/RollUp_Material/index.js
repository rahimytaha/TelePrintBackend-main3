/** @format */

const BaseController = require("../../../BaseController")
const RollUp_MaterialService = require("../../../../service/v1/RollUp_Material")
const RollUp_Record = require("../../../../service/v1/RollUp_Record")
const RollUp_MaterialView = require("../../../../view/client/v1/RollUp_MaterialView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class RollUp_MaterialController extends BaseController {
  async getAll(req, res) {
    try {
      const RollUp_Materials = await RollUp_MaterialService.findAllAndSort({}, "sort")

      if (!RollUp_Materials || !RollUp_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const MatrialWithPrice = await Promise.all(
        RollUp_Materials.map(async (Material) => {
          const Price = await RollUp_Record.calculatorPrice(req, Material)
          return { ...Material, price: Price }
        })
      )
      return res.status(200).json({
        data: RollUp_MaterialView.transformCollection(MatrialWithPrice)
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

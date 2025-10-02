/** @format */

const BaseController = require("../../../BaseController")
const Poster_MaterialService = require("../../../../service/v1/Poster_Material")
const Poster_Record = require("../../../../service/v1/Poster_Record")
const Poster_MaterialView = require("../../../../view/client/v1/Poster_MaterialView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class Poster_MaterialController extends BaseController {
  async getAll(req, res) {
    try {
      const Poster_Materials = await Poster_MaterialService.findAllAndSort({}, { sort: 1 })

      if (!Poster_Materials || !Poster_Materials.length) {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }

      const MatrialWithPrice = await Promise.all(
        Poster_Materials.map(async (Material) => {
          const Price = await Poster_Record.calculatorPrice(req, Material)
          return { ...Material, price: Price }
        })
      )
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
})()

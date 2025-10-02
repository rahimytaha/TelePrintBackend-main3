/** @format */

const BaseController = require("../../../BaseController")
const Shape_EtikettenService = require("../../../../service/v1/Shape_Etiketten")
const Shape_EtikettenView = require("../../../../view/client/v1/Shape_EtikettenView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Shape_EtikettenController extends BaseController {
  async getAll(req, res) {
    try {
      const Shape_Etikettens = await Shape_EtikettenService.findAllAndPopulateImage({})

      if (Shape_Etikettens && Shape_Etikettens.length) {
        return res.status(200).json({
          data: Shape_EtikettenView.transformCollection(Shape_Etikettens)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "نوع ارسالی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

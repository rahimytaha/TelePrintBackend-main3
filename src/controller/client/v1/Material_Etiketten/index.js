/** @format */

const BaseController = require("../../../BaseController")
const Material_EtikettenService = require("../../../../service/v1/Material_Etiketten")
const Material_EtikettenView = require("../../../../view/client/v1/Material_EtikettenView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Material_EtikettenController extends BaseController {
  async getAll(req, res) {
    try {
      const Material_Etikettens = await Material_EtikettenService.findAllAndPopulateImage({})

      if (Material_Etikettens && Material_Etikettens.length) {
        return res.status(200).json({
          data: Material_EtikettenView.transformCollection(Material_Etikettens)
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

/** @format */

const BaseController = require("../../../BaseController")
const EndFormat_EtikettenService = require("../../../../service/v1/EndFormat_Etiketten")
const EndFormat_EtikettenView = require("../../../../view/client/v1/EndFormat_EtikettenView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class EndFormat_EtikettenController extends BaseController {
  async getAll(req, res) {
    try {
      const EndFormat_Etikettens = await EndFormat_EtikettenService.findAllAndPopulateImage({})

      if (EndFormat_Etikettens && EndFormat_Etikettens.length) {
        return res.status(200).json({
          data: EndFormat_EtikettenView.transformCollection(EndFormat_Etikettens)
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

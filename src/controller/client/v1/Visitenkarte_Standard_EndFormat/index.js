/** @format */

const BaseController = require("../../../BaseController")
const Visitenkarte_Standard_EndFormatService = require("../../../../service/v1/Visitenkarte_Standard_EndFormat")
const Visitenkarte_Standard_EndFormatView = require("../../../../view/client/v1/Visitenkarte_Standard_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Visitenkarte_Standard_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const Visitenkarte_Standard_EndFormats = await Visitenkarte_Standard_EndFormatService.findAllAndSort({}, "sort")

      if (Visitenkarte_Standard_EndFormats && Visitenkarte_Standard_EndFormats.length) {
        return res.status(200).json({
          data: Visitenkarte_Standard_EndFormatView.transformCollection(Visitenkarte_Standard_EndFormats)
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

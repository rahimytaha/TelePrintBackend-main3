/** @format */

const BaseController = require("../../../BaseController")
const Visitenkarte_Klapp_EndFormatService = require("../../../../service/v1/Visitenkarte_Klapp_EndFormat")
const Visitenkarte_Klapp_EndFormatView = require("../../../../view/client/v1/Visitenkarte_Klapp_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Visitenkarte_Klapp_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const Visitenkarte_Klapp_EndFormats = await Visitenkarte_Klapp_EndFormatService.findAllAndSort({}, "sort")

      if (Visitenkarte_Klapp_EndFormats && Visitenkarte_Klapp_EndFormats.length) {
        return res.status(200).json({
          data: Visitenkarte_Klapp_EndFormatView.transformCollection(Visitenkarte_Klapp_EndFormats)
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

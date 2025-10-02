/** @format */

const BaseController = require("../../../BaseController")
const Brochure_EndFormatService = require("../../../../service/v1/Brochure_EndFormat")
const Brochure_EndFormatView = require("../../../../view/client/v1/Brochure_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Brochure_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const Brochure_EndFormats = await Brochure_EndFormatService.findAllAndSort({}, "sort")

      if (Brochure_EndFormats && Brochure_EndFormats.length) {
        return res.status(200).json({
          data: Brochure_EndFormatView.transformCollection(Brochure_EndFormats)
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

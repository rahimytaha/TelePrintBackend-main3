/** @format */

const BaseController = require("../../../BaseController")
const Flyer_EndFormatService = require("../../../../service/v1/Flyer_EndFormat")
const Flyer_EndFormatView = require("../../../../view/client/v1/Flyer_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Flyer_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const Flyer_EndFormats = await Flyer_EndFormatService.findAllAndSort({}, "sort")

      if (Flyer_EndFormats && Flyer_EndFormats.length) {
        return res.status(200).json({
          data: Flyer_EndFormatView.transformCollection(Flyer_EndFormats)
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

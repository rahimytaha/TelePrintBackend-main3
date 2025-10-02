/** @format */

const BaseController = require("../../../BaseController")
const Poster_EndFormatService = require("../../../../service/v1/Poster_EndFormat")
const Poster_EndFormatView = require("../../../../view/client/v1/Poster_EndFormat")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Poster_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const Poster_EndFormats = await Poster_EndFormatService.findAllAndSort({}, { sort: 1 })

      if (Poster_EndFormats && Poster_EndFormats.length) {
        return res.status(200).json({
          data: Poster_EndFormatView.transformCollection(Poster_EndFormats)
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

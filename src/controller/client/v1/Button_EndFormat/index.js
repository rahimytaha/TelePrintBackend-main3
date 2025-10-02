/** @format */

const BaseController = require("../../../BaseController")
const Button_EndFormatService = require("../../../../service/v1/Button_EndFormat")
const Button_EndFormatView = require("../../../../view/client/v1/Button_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Button_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const Button_EndFormats = await Button_EndFormatService.findAllAndSort({}, "sort")

      if (Button_EndFormats && Button_EndFormats.length) {
        return res.status(200).json({
          data: Button_EndFormatView.transformCollection(Button_EndFormats)
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

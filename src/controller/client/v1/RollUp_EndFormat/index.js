/** @format */

const BaseController = require("../../../BaseController")
const RollUp_EndFormatService = require("../../../../service/v1/RollUp_EndFormat")
const RollUp_EndFormatView = require("../../../../view/client/v1/RollUp_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class RollUp_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const RollUp_EndFormats = await RollUp_EndFormatService.findAllAndSort({}, "sort")

      if (RollUp_EndFormats && RollUp_EndFormats.length) {
        return res.status(200).json({
          data: RollUp_EndFormatView.transformCollection(RollUp_EndFormats)
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

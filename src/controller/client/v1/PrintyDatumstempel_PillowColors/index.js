/** @format */

const BaseController = require("../../../BaseController")
const PrintyDatumstempel_PillowColorService = require("../../../../service/v1/PrintyDatumstempel_PillowColor")
const PrintyDatumstempel_PillowColorView = require("../../../../view/client/v1/PrintyDatumstempel_PillowColor")
const { GeneralFront } = require("../../../../log")

module.exports = new (class PrintyDatumstempel_PillowColorController extends BaseController {
  async getAll(req, res) {
    try {
      const PrintyDatumstempel_PillowColors = await PrintyDatumstempel_PillowColorService.findAllAndPopulateImage({})

      if (PrintyDatumstempel_PillowColors && PrintyDatumstempel_PillowColors.length) {
        return res.status(200).json({
          data: PrintyDatumstempel_PillowColorView.transformCollection(PrintyDatumstempel_PillowColors)
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

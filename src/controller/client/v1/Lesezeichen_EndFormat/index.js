/** @format */

const BaseController = require("../../../BaseController")
const FolderEin_EndFormatService = require("../../../../service/v1/Lesezeichen_EndFormat")
const FolderEin_EndFormatView = require("../../../../view/client/v1/Lesezeichen_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class FolderEin_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const FolderEin_EndFormats = await FolderEin_EndFormatService.findAllAndSort({}, "sort")
      if (FolderEin_EndFormats && FolderEin_EndFormats.length) {
        return res.status(200).json({
          data: FolderEin_EndFormatView.transformCollection(FolderEin_EndFormats)
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

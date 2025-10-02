/** @format */

const BaseController = require("../../../BaseController")
const FolderWickelfalz8seiten_EndFormatService = require("../../../../service/v1/FolderWickelfalz8seiten_EndFormat")
const FolderWickelfalz8seiten_EndFormatView = require("../../../../view/client/v1/FolderWickelfalz8seiten_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class FolderWickelfalz8seiten_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const FolderWickelfalz8seiten_EndFormats = await FolderWickelfalz8seiten_EndFormatService.findAllAndSort({}, "sort")
      if (FolderWickelfalz8seiten_EndFormats && FolderWickelfalz8seiten_EndFormats.length) {
        return res.status(200).json({
          data: FolderWickelfalz8seiten_EndFormatView.transformCollection(FolderWickelfalz8seiten_EndFormats)
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

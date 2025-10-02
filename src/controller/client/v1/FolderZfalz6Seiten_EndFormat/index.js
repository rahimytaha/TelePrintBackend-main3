/** @format */

const BaseController = require("../../../BaseController")
const FolderZfalz6Seiten_EndFormatService = require("../../../../service/v1/FolderZfalz6Seiten_EndFormat")
const FolderZfalz6Seiten_EndFormatView = require("../../../../view/client/v1/FolderZfalz6Seiten_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class FolderZfalz6Seiten_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const FolderZfalz6Seiten_EndFormats = await FolderZfalz6Seiten_EndFormatService.findAllAndSort({}, "sort")
      if (FolderZfalz6Seiten_EndFormats && FolderZfalz6Seiten_EndFormats.length) {
        return res.status(200).json({
          data: FolderZfalz6Seiten_EndFormatView.transformCollection(FolderZfalz6Seiten_EndFormats)
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

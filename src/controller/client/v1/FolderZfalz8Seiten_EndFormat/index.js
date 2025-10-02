/** @format */

const BaseController = require("../../../BaseController")
const FolderZfalz8Seiten_EndFormatService = require("../../../../service/v1/FolderZfalz8Seiten_EndFormat")
const FolderZfalz8Seiten_EndFormatView = require("../../../../view/client/v1/FolderZfalz8Seiten_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class FolderZfalz8Seiten_EndFormatController extends BaseController {
  async getAll(req, res) {
    try {
      const FolderZfalz8Seiten_EndFormats = await FolderZfalz8Seiten_EndFormatService.findAllAndSort({}, "sort")
      if (FolderZfalz8Seiten_EndFormats && FolderZfalz8Seiten_EndFormats.length) {
        return res.status(200).json({
          data: FolderZfalz8Seiten_EndFormatView.transformCollection(FolderZfalz8Seiten_EndFormats)
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

/** @format */

const BaseController = require("../../../BaseController")
const FolderWickelfalz6seitenService = require("../../../../service/v1/FolderWickelfalz6seiten_EndFormat")
const FolderWickelfalz6seitenView = require("../../../../view/client/v1/FolderWickelfalz6seiten_EndFormatView")
const { GeneralFront } = require("../../../../log")

module.exports = new (class FolderWickelfalz6seitenController extends BaseController {
  async getAll(req, res) {
    try {
      const FolderWickelfalz6seitens = await FolderWickelfalz6seitenService.findAllAndSort({}, { sort: 1 })
      if (FolderWickelfalz6seitens && FolderWickelfalz6seitens.length) {
        return res.status(200).json({
          data: FolderWickelfalz6seitenView.transformCollection(FolderWickelfalz6seitens)
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

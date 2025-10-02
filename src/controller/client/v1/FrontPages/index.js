/** @format */

const BaseController = require("../../../BaseController")
const FrontPagesService = require("../../../../service/v1/FrontPages")
const FrontPagesView = require("../../../../view/client/v1/FrontPagesView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class FrontPagesController extends BaseController {
  async getAll(req, res) {
    try {
      const FrontPagess = await FrontPagesService.findAll({})
      if (FrontPagess && FrontPagess.length) {
        return res.status(200).json({
          data: FrontPagesView.transformCollection(FrontPagess)
        })
      } else {
        return res.status(204).json({
          data: []
        })
      }
    } catch (err) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
  async getByKey(req, res) {
    try {
      if (!req.params.key) {
        return res.status(400).json({
          data: {},
          message: "Key is required"
        })
      }

      const FrontPages = await FrontPagesService.findOneByCondition({
        key: req.params.key
      })
      if (FrontPages) {
        return res.status(200).json({
          data: FrontPagesView.transform(FrontPages)
        })
      } else {
        return res.status(204).json({
          data: {},
          message: "منطقه ی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

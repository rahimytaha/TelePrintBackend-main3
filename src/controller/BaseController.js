/** @format */
const CustomForm_Etiketten = require("../service/v1/CustomForm_Etiketten")
const EndFormat_Etiketten = require("../service/v1/EndFormat_Etiketten")
const Material_Etiketten = require("../service/v1/Material_Etiketten")
const Shape_Etiketten = require("../service/v1/Shape_Etiketten")
const DigiPrint_Material = require("../service/v1/DigiPrint_Material")
const Flyer_EndFormat = require("../service/v1/Flyer_EndFormat")
const FolderEin_EndFormat = require("../service/v1/FolderEin_EndFormat")
const FolderWickelfalz6seiten_EndFormat = require("../service/v1/FolderWickelfalz6seiten_EndFormat")
const FolderWickelfalz8seiten_EndFormat = require("../service/v1/FolderWickelfalz8seiten_EndFormat")
const FolderZfalz6Seiten_EndFormat = require("../service/v1/FolderZfalz6Seiten_EndFormat")
const FolderZfalz8Seiten_EndFormat = require("../service/v1/FolderZfalz8Seiten_EndFormat")
const Lesezeichen_EndFormat = require("../service/v1/Lesezeichen_EndFormat")
const RollUp_EndFormat = require("../service/v1/RollUp_EndFormat")
const RollUp_Material = require("../service/v1/RollUp_Material")
const Lesezeichen_Material = require("../service/v1/Lesezeichen_Material")
const Button_EndFormat = require("../service/v1/Button_EndFormat")
const AdminService = require("../service/v1/Admin")
const Visitenkarte_Klapp_EndFormatService = require("../service/v1/Visitenkarte_Klapp_EndFormat")
const Visitenkarte_Standard_EndFormatService = require("../service/v1/Visitenkarte_Standard_EndFormat")
const PrintyDatumstempel_Art = require("../service/v1/PrintyDatumstempel_Art")
const PrintyDatumstempel_PillowColor = require("../service/v1/PrintyDatumstempel_PillowColor")
const { GeneralPanel } = require("../log")

module.exports = class Controller {
  async initialize(req, res) {
    try {
      const object = {
        firstName: "alex",
        lastName: "frostWolf",
        phoneNumber: "09039829849",
        userName: "alex",
        password: 123456,
        isSuperUser: true
      }
      await AdminService.createFirstAdminService(object)
      await CustomForm_Etiketten.initialize()
      await EndFormat_Etiketten.initialize()
      await Material_Etiketten.initialize()
      await Shape_Etiketten.initialize()
      await DigiPrint_Material.initialize()
      await Flyer_EndFormat.initialize()
      await FolderEin_EndFormat.initialize()
      await FolderWickelfalz6seiten_EndFormat.initialize()
      await FolderWickelfalz8seiten_EndFormat.initialize()
      await FolderZfalz6Seiten_EndFormat.initialize()
      await FolderZfalz8Seiten_EndFormat.initialize()
      await Lesezeichen_EndFormat.initialize()
      await RollUp_EndFormat.initialize()
      await RollUp_Material.initialize()
      await Lesezeichen_Material.initialize()
      await Button_EndFormat.initialize()
      await Visitenkarte_Klapp_EndFormatService.initialize()
      await Visitenkarte_Standard_EndFormatService.initialize()
      await PrintyDatumstempel_Art.initialize()
      await PrintyDatumstempel_PillowColor.initialize()

      return res.status(200).json({
        message: "it is done"
      })
    } catch (error) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async endFormatFixer(req, res) {
    try {
      await FolderWickelfalz6seiten_EndFormat.initialize()
      await FolderWickelfalz8seiten_EndFormat.initialize()
      await FolderZfalz6Seiten_EndFormat.initialize()
      await FolderZfalz8Seiten_EndFormat.initialize()

      return res.status(200).json({
        message: "it is done"
      })
    } catch (error) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
}

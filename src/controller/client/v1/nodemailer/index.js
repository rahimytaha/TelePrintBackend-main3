/** @format */

const BaseController = require("../../../BaseController")
const { sendSimpleEmail } = require("../../../../util/nodeMailer")
module.exports = new (class nodemailerController extends BaseController {
  async createOrder(req, res) {
    try {
      await sendSimpleEmail("alexfrostwolf3@gmail.com", "test", "html", [])
      return res.status(200).json({
        data: "",
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    } catch (error) {
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

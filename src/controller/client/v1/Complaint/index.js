/** @format */

const BaseController = require("../../../BaseController")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const ComplaintService = require("../../../../service/v1/Complaint")
const ComplaintView = require("../../../../view/client/v1/Complaint")
const { sendComplaint } = require("../../../../util/nodeMailer")
const { GeneralFront } = require("../../../../log")

module.exports = new (class Button_RecordController extends BaseController {
  async createOrder(req, res) {
    try {
      const Object = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        file1: req.files && req.files.file1 && req.files.file1[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file1[0].filename : "",
        file2: req.files && req.files.file2 && req.files.file2[0] ? BASE_URL_FOR_MULTER + "/files/" + req.files.file2[0].filename : ""
      }
      const CreatedOrder = await ComplaintService.createObject(Object)

      if (!CreatedOrder) {
        res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
        return
      }

      await sendComplaint(CreatedOrder)
      return res.status(200).json({
        data: ComplaintView.transform(CreatedOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

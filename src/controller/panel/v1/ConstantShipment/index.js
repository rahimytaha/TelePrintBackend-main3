/** @format */

const BaseController = require("../../../BaseController")
const ConstantShipmentService = require("../../../../service/v1/ConstantShipment")
const ConstantShipmentView = require("../../../../view/panel/v1/ConstantShipmentView")
const { BASE_URL_FOR_MULTER } = require("../../../../config")

module.exports = new (class ConstantShipmentController extends BaseController {
  async create(req, res) {
    try {
      const object = {
        name: req.body.name,
        cost: req.body.cost,
        du_name: req.body.du_name,
        freeAfterAmount: req.body.freeAfterAmount,
        icon: req.file ? BASE_URL_FOR_MULTER + "/gallery/" + req.file.filename : ""
      }

      const existConstantShipment = await ConstantShipmentService.findOneByCondition({
        name: req.body.name
      })
      if (existConstantShipment) {
        return res.status(400).json({
          data: "",
          message: "قبلا ثبت شده"
        })
      }

      const createConstantShipment = await ConstantShipmentService.createObject(object)

      if (createConstantShipment) {
        return res.status(201).json({
          data: ConstantShipmentView.transform(createConstantShipment),
          message: "شیوه ارسال ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "شیوه ارسال قابل ثبت نیست."
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

  async getAll(req, res) {
    try {
      const ConstantShipments = await ConstantShipmentService.findAllAndPopulate({})
      if (ConstantShipments && ConstantShipments.length) {
        return res.status(200).json({
          data: ConstantShipmentView.transformCollection(ConstantShipments)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "شیوه ارسالی ثبت نشده است."
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

  async getById(req, res) {
    try {
      const ConstantShipment = await ConstantShipmentService.findOneByCondition({
        _id: req.params.id
      })

      if (ConstantShipment) {
        return res.status(200).json({
          data: ConstantShipmentView.transform(ConstantShipment)
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "آیدی اشتباه است"
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

  async deleteConstantShipment(req, res) {
    try {
      const deletedConstantShipment = await ConstantShipmentService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedConstantShipment) {
        const deleteConstantShipment = await ConstantShipmentView.transform(deletedConstantShipment)
        return res.status(200).json({
          data: deleteConstantShipment,
          message: "شیوه ارسال مورد نظر حذف شد"
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "شیوه ارسال یافت نشد"
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

  async updateConstantShipment(req, res) {
    try {
      //! check send Id is true
      const existUser = await ConstantShipmentService.findById(req.params.id)

      if (!existUser) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const newConstantShipment = {
        name: req.body.name || existUser.name,
        du_name: req.body.du_name || existUser.du_name,
        cost: req.body.cost || req.body.cost === 0 ? req.body.cost : existUser.cost,
        freeAfterAmount: req.body.freeAfterAmount || req.body.freeAfterAmount === 0 ? req.body.freeAfterAmount : existUser.freeAfterAmount,
        icon: req.file ? BASE_URL_FOR_MULTER + "/gallery/" + req.file.filename : existUser.icon
      }

      const updateConstantShipment = await ConstantShipmentService.update({ _id: req.params.id }, newConstantShipment, true)

      if (updateConstantShipment) {
        return res.status(200).json({
          data: ConstantShipmentView.transform(updateConstantShipment),
          message: "شیوه ارسال ویرایش شد."
        })
      }
    } catch (error) {
      GeneralPanel.error(error)
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async initialize(req, res) {
    try {
      const createInvoiceStatus = await ConstantShipmentService.initialize()

      const InvoiceStatuss = await ConstantShipmentService.findAll({})
      return res.status(200).json({
        data: ConstantShipmentView.transformCollection(InvoiceStatuss)
      })
    } catch (error) {
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

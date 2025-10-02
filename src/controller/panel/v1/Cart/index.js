/** @format */

const BaseController = require("../../../BaseController")
const CartService = require("../../../../service/v1/Cart")
const OrderStatusService = require("../../../../service/v1/OrderStatus")
const CartView = require("../../../../view/panel/v1/CartView")
const { GeneralPanel } = require("../../../../log")
const { sendMail, ChangeStatus } = require("../../../../util/nodeMailer")
const { paginationTools } = require("../../../../util")

module.exports = new (class CartController extends BaseController {
  async getAll(req, res) {
    try {
      const Carts = await CartService.findAllAndPopulate(
        {
          ...(Number(req.params.statusCode) === -1 || !req.params.statusCode ? {} : { statusCode: Number(req.params.statusCode) })
        },
        [
          {
            path: "orderItems",
            populate: {
              path: "tableId",
              populate: {
                path: "materialId"
              }
            }
          },
          {
            path: "shipment"
          },
          {
            path: "statusId"
          },
          {
            path: "shippingAddress"
          },

          {
            path: "billingAddress"
          }
        ]
      )
      if (Carts && Carts.length) {
        return res.status(200).json({
          data: Carts
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async getAllSearch(req, res) {
    try {
      const { page, limit, sort, condition } = req.body
      const ReservedStatus = await OrderStatusService.findOneByCondition({ key: "Reserved" })
      const newCondition = { statusId: { $ne: ReservedStatus._id }, ...condition }
      const skip = (page - 1) * limit
      const Carts = await CartService.model
        .find(newCondition)
        .sort(sort ? sort : { createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate([
          {
            path: "orderItems",
            populate: {
              path: "tableId",
              populate: {
                path: "materialId"
              }
            }
          },
          {
            path: "shipment"
          },
          {
            path: "userId"
          },
          {
            path: "invoiceId"
          },
          {
            path: "statusId"
          },
          {
            path: "shippingAddress"
          },
          ,
          {
            path: "billingAddress"
          }
        ])

      if (Carts && Carts.length) {
        return res.status(200).json({
          data: CartView.transformCollection(Carts)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }
  async getAllMetaData(req, res) {
    try {
      const { page, limit, sort, condition } = req.body
      const ReservedStatus = await OrderStatusService.findOneByCondition({ key: "Reserved" })
      const newCondition = { statusId: { $ne: ReservedStatus._id }, ...condition }
      const newProducts = await CartService.model.find(newCondition).countDocuments()

      const metaData = paginationTools(newProducts, page, limit)

      return res.status(200).json({
        metaData: metaData
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }
  async getById(req, res) {
    try {
      const Flyer_EndFormat = await CartService.findOneByConditionAndPopulate(
        {
          _id: req.params.id
        },
        [
          {
            path: "orderItems",
            populate: {
              path: "tableId",
              populate: {
                path: "materialId"
              }
            }
          },
          {
            path: "shipment"
          },
          {
            path: "userId"
          },
          {
            path: "invoiceId"
          },
          {
            path: "shippingAddress"
          },
          ,
          {
            path: "billingAddress"
          }
        ]
      )

      if (Flyer_EndFormat) {
        return res.status(200).json({
          data: CartView.transform(Flyer_EndFormat)
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
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async updateStatus(req, res) {
    try {
      const thisCart = await CartService.findOneByConditionAndPopulate(
        {
          _id: req.params.id
        },

        [
          {
            path: "orderItems",
            populate: {
              path: "tableId",
              populate: {
                path: "materialId"
              }
            }
          },
          {
            path: "userId"
          },
          {
            path: "shippingAddress"
          },
          {
            path: "shipment"
          }
        ]
      )
      if (!thisCart) {
        return res.status(400).json({
          data: {},
          message: "آیدی اشتباه است"
        })
      }
      const statusObject = await OrderStatusService.findOneByCondition({ _id: req.body.statusId })
      if (statusObject.sendEmail) {
        await ChangeStatus({ ...thisCart._doc, status: statusObject })
      }
      const updateCart = await CartService.update(
        {
          _id: req.params.id
        },
        { statusId: req.body.statusId },
        true
      )
      return res.status(200).json({
        data: CartView.transform(updateCart)
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }

  async getAllStatus(req, res) {
    try {
      const statusObject = await OrderStatusService.findAll({})
      return res.status(200).json({
        data: statusObject
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async test(req, res) {
    try {
      const generatedCartNumber = await CartService.CreateInovice(req.body.orderItems, req.body.total)

      if (!generatedCartNumber) {
        return res.status(400).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }
      return res.status(200).json({
        data: CartView.transform(generatedCartNumber)
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }
})()

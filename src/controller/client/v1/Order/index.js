/** @format */

const BaseController = require("../../../BaseController")
const OrderService = require("../../../../service/v1/Order")
const PaymentService = require("../../../../service/v1/Payment")
const OrderView = require("../../../../view/client/v1/OrderView")
const PaymentView = require("../../../../view/client/v1/PaymentView")
const axios = require("axios")
const qs = require("qs")
const { Secret_key, returnUrl } = require("../../../../config/stripe")
const { client_id, client_secret, BasicPayPalUrl, accessToken } = require("../../../../config/paypal")

const { GeneralPanel, Paypal } = require("../../../../log")
const { sendMail, sendBill } = require("../../../../util/nodeMailer")
const InvoiceService = require("../../../../service/v1/Invoice")

const stripe = require("stripe")(Secret_key)
module.exports = new (class OrderController extends BaseController {
  async getAll(req, res) {
    try {
      let Orders = []
      if (req.user) {
        Orders = await OrderService.findAllAndPopulate(
          {
            userId: req.user._id,
            statusName: req.body.statusName === "not_paid" ? { $in: ["not_submitted", "payment_processing"] } : req.body.statusName
          },
          {
            path: "tableId",
            populate: {
              path: "materialId"
            }
          }
        )
        if (!Orders || !Orders.length) {
          Orders = await OrderService.findAllAndPopulate(
            {
              phoneNumber: req.user.phoneNumber,
              email: req.user.email,
              statusName: req.body.statusName === "not_paid" ? { $in: ["not_submitted", "payment_processing"] } : req.body.statusName
            },
            {
              path: "tableId",
              populate: {
                path: "materialId"
              }
            }
          )
        }
      } else {
        Orders = await OrderService.findAllAndPopulate(
          {
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            statusName: req.body.statusName === "not_paid" ? { $in: ["not_submitted", "payment_processing"] } : req.body.statusName
          },
          {
            path: "tableId",
            populate: {
              path: "materialId"
            }
          }
        )
      }

      if (Orders && Orders.length) {
        return res.status(200).json({
          data: OrderView.transformCollection(Orders)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
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
  async getAllStatus(req, res) {
    try {
      const Orders = ["not_submitted", "submitted", "compelete", "payment_processing", "not_paid"]
      if (Orders && Orders.length) {
        return res.status(200).json({
          data: Orders
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
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

  async payment(req, res) {
    try {
      const amount = await OrderService.calculateOrderAmount(req)
      if (!amount) {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
        })
      }
      const payout = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "eur"
      })

      if (!payout.client_secret) {
        return res.status(400).json({
          data: payout,
          message: "stripe problem"
        })
      }

      const paymentRecord = await PaymentService.CreatePayment(req.body.email, payout)
      if (!paymentRecord) {
        return res.status(402).json({
          data: ""
        })
      }
      await OrderService.handleChangeStatus(req)

      return res.status(200).json({
        data: PaymentView.transform({ ...paymentRecord._doc, amount: amount })
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
  async paypalStart(req, res) {
    try {
      await OrderService.handleChangeStatus(req)
      return res.status(200).json({
        data: ""
      })
    } catch (error) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
  async paypalPayment(req, res) {
    try {
      const sendTokenBody = qs.stringify({
        grant_type: "client_credentials"
      })
      const usernamePasswordBuffer = Buffer.from(client_id + ":" + client_secret)
      const base64data = usernamePasswordBuffer.toString("base64")

      const configToken = {
        method: "post",
        url: `${BasicPayPalUrl}/v1/oauth2/token`,

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${base64data}`
        },
        data: sendTokenBody
      }
      const tokenData = await axios(configToken)

      const Token = tokenData.data.access_token
      if (Token) {
        const { id, phoneNumber, email } = req.body
        const configGetData = {
          method: "get",
          url: `${BasicPayPalUrl}/v2/payments/captures/${id}`,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`
          }
        }

        const { data } = await axios(configGetData)
        Paypal.debug({ data: data })
        if (String(data.status) === "COMPLETED") {
          const ordersItems = await OrderService.findAllAndPopulate(
            {
              phoneNumber: phoneNumber,
              email: email,
              statusName: "payment_processing"
            },
            {
              path: "tableId",
              populate: {
                path: "materialId"
              }
            }
          )

          await OrderService.updateAll(
            {
              phoneNumber: phoneNumber,
              email: email,
              statusName: "payment_processing"
            },
            {
              statusName: "submitted"
            }
          )
          if (ordersItems && ordersItems.length) {
            const createdInvoice = await InvoiceService.CreateInovice(
              ordersItems,
              data && data.amount && data.amount.value ? Number(data.amount.value) : 0
            )
            await sendBill(ordersItems)
          }

          return res.status(200).json({
            data: "",
            message: "payment is  compeleted"
          })
        } else {
          return res.status(400).json({
            data: "",
            message: "payment is not compeleted"
          })
        }
      } else {
        return res.status(400).json({
          data: "",
          message: "token is not received"
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

  async callbackStripe(req, res) {
    try {
      const sig = req.headers["stripe-signature"]
      const { object } = req.body.data
      if (!object || !object.status || object.status !== "succeeded") {
        return res.status(400).send(`object.status is not succeeded`)
      }

      const existClientSecret = await PaymentService.findOneByCondition({
        client_secret: object.client_secret,
        statusCode: 0
      })
      console.log("existClientSecret", existClientSecret)
      await PaymentService.update({ _id: existClientSecret._id }, { statusCode: 200 })

      const ordersItems = await OrderService.findAllAndPopulate(
        {
          email: existClientSecret.email,
          statusName: "payment_processing"
        },
        {
          path: "tableId",
          populate: {
            path: "materialId"
          }
        }
      )

      await OrderService.updateAll(
        {
          email: existClientSecret.email,
          statusName: "payment_processing"
        },
        {
          statusName: "submitted"
        }
      )
      if (ordersItems && ordersItems.length) {
        const createdInvoice = await InvoiceService.CreateInovice(ordersItems, Number(object.amount) / 100)

        await sendBill(ordersItems)
      }

      return res.send()
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
    // Return a 200 response to acknowledge receipt of the event
  }

  async getAllsubmitted(req, res) {
    try {
      const Orders = await OrderService.findAllAndPopulate(
        {
          phoneNumber: req.params.phoneNumber,
          statusName: "submitted"
        },
        {
          path: "tableId",
          populate: {
            path: "materialId"
          }
        }
      )
      if (Orders && Orders.length) {
        return res.status(200).json({
          data: OrderView.transformCollection(Orders)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
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

  async getAllCompelete(req, res) {
    try {
      const Orders = await OrderService.findAllAndPopulate(
        {
          phoneNumber: req.params.phoneNumber,
          statusName: "compelete"
        },
        {
          path: "tableId",
          populate: {
            path: "materialId"
          }
        }
      )
      if (Orders && Orders.length) {
        return res.status(200).json({
          data: OrderView.transformCollection(Orders)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
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
      const Order = await OrderService.findOneByConditionAndPopulate(
        {
          _id: req.params.id
        },
        {
          path: "tableId",
          populate: {
            path: "materialId"
          }
        }
      )
      if (Order) {
        return res.status(200).json({
          data: OrderView.transform(Order)
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

  async DeleteOrder(req, res) {
    try {
      const deletedCategory = await OrderService.hardDelete({
        _id: req.params.id
      })

      if (deletedCategory) {
        return res.status(200).json({
          data: "",
          message: "منطقه مورد نظر حذف شد"
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "منطقه یافت نشد"
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

  async testOrder(req, res) {
    try {
      const { ids } = req.body

      const ordersItems = await OrderService.findAllAndPopulate(
        {
          _id: ids
        },
        {
          path: "tableId",
          populate: {
            path: "materialId"
          }
        }
      )
      let total = 0
      ordersItems.map((item) => {
        total += item.tableId.finalPrice
      })
      if (ordersItems && ordersItems.length) {
        const createdInvoice = await InvoiceService.CreateInoviceTest(ordersItems, Number(total))
        await sendBill(ordersItems)
      }

      return res.send()
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
    // Return a 200 response to acknowledge receipt of the event
  }
})()

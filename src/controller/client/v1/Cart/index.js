/** @format */

const BaseController = require("../../../BaseController")
const CartService = require("../../../../service/v1/Cart")
const OrderService = require("../../../../service/v1/Order")
const ConstantShipmentService = require("../../../../service/v1/ConstantShipment")
const AddressService = require("../../../../service/v1/Address")
const OrderStatusService = require("../../../../service/v1/OrderStatus")
const PaymentService = require("../../../../service/v1/Payment")
const CartView = require("../../../../view/client/v1/CartView")
const PaymentView = require("../../../../view/client/v1/PaymentView")
const axios = require("axios")
const path = require("path")
const qs = require("qs")
const fs = require("fs")
const moment = require("moment")
const pdf = require("html-pdf")
const { client_id, client_secret, BasicPayPalUrl, accessToken } = require("../../../../config/paypal")
const { createPaymentIntent, sessionRetriever } = require("../../../../thirdPartyAPI/Stripe")
const { GeneralPanel, Paypal } = require("../../../../log")
const { sendMail, sendBill, sendBillNew, spotPaymentSend } = require("../../../../util/nodeMailer")
const InvoiceService = require("../../../../service/v1/Invoice")
const { htmlAddress } = require("./utils")
const { paginationTools } = require("../../../../util")

module.exports = new (class OrderController extends BaseController {
  async getCart(req, res) {
    try {
      const ReservedStatus = await OrderStatusService.findOneByCondition({
        key: "Reserved"
      })
      const cart = await CartService.findOneByConditionAndPopulate(
        {
          userId: req.user._id,
          statusId: ReservedStatus._id
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
          ,
          {
            path: "shippingAddress"
          },

          {
            path: "billingAddress"
          },
          {
            path: "userId"
          },
          {
            path: "invoiceId"
          }
        ]
      )

      if (!cart) {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
        })
      }
      return res.status(200).json({
        data: CartView.transform(cart)
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getPdf(req, res) {
    try {
      const CreatedInvoice = await CartService.model
        .findOne({
          userId: req.user._id,
          _id: req.params.id
        })
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
            path: "userId"
          },
          {
            path: "shippingAddress"
          },
          {
            path: "invoiceId"
          },
          {
            path: "shipment"
          }
        ])
        .lean()

      // createPdf
      const options = {
        format: "A4",
        footer: {
          height: "90px"
        }
      }
      const url = path.join(__dirname, "../../../../util/invoice/pdf.html")
      let sourcePdf = fs.readFileSync(url, "utf8")

      let body = ""
      const shipment = CreatedInvoice.shipment
      if (shipment.cost > 0) {
        const shipmentObject = {
          productName: "Versand",
          tableId: { count: 1, finalPrice: 12 }
        }
        CreatedInvoice.orderItems.push(shipmentObject)
      }

      CreatedInvoice.orderItems.map((order) => {
        body += `<tr>
        <td class="Beschreibung">
            <span>${order.productName}</span>

        </td>
        <td class="Menge">${order.tableId && order.tableId.count ? order.tableId.count : 1}</td>
        <td class="Preis">
        ${(order.tableId.finalPrice / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        €</td>
        <td class="Netto">
        ${order.tableId.finalPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        €</td>
    </tr>`
      })
      let customerDetails = ""
      switch (CreatedInvoice?.userId?.customertype) {
        case "Privatkunde":
          customerDetails = `<div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.gender === "Man" ? "Herr" : "Frau"} ${
            CreatedInvoice?.userId?.firstName
          } ${CreatedInvoice?.userId?.lastName}</span>
        </div>
    </div>
    <div >
      <span style="font-size: 10px !important;">Adresse :</span>
            <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

      </div>
    <div>
    </div>
    `
          break
        case "Busineskunde":
          customerDetails = `
             ${
               CreatedInvoice?.userId?.company
                 ? `<div>
      <span style="font-size: 10px !important;">Firma :</span>
      <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.company}</span>
      </div>`
                 : ""
             }
      ${
        CreatedInvoice?.userId?.firstName || CreatedInvoice?.userId?.lastName
          ? `     <div>
      <span style="font-size: 10px !important;">Name  :</span>
      <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.gender === "Man" ? "Herr" : "Frau"} ${CreatedInvoice?.userId?.firstName} ${
              CreatedInvoice?.userId?.lastName
            }</span>
      </div>`
          : `
        <div>
      <span style="font-size: 10px !important;">Liebe Kundin, lieber Kunde</span>
      </div>
        `
      }
      
      <div >
      <span style="font-size: 10px !important;">Adresse :</span>
                  <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

      </div>
      ${
        CreatedInvoice?.userId?.UID_Nummer
          ? ` <div>
      <span style="font-size: 10px !important;">UID-Nummer :</span>
      <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.UID_Nummer}</span>
      </div>`
          : ""
      }
      `
          // <div>
          // <span>Branche :</span>
          // <span >${CreatedInvoice?.userId?.industry}</span>
          // </div>
          break

        case "Partner":
          customerDetails = `
        ${
          CreatedInvoice?.userId?.firstName || CreatedInvoice?.userId?.lastName
            ? `     <div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.gender === "Man" ? "Herr" : "Frau"} ${
                CreatedInvoice?.userId?.firstName
              } ${CreatedInvoice?.userId?.lastName}</span>
        </div>`
            : `
          <div>
        <span style="font-size: 10px !important;">Liebe Kundin, lieber Kunde</span>
        </div>
          `
        }
        <div>
        <span style="font-size: 10px !important;">Adresse :</span>
               <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

        </div>
        <span style="font-size: 10px !important;">Branche :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.industry}</span>
        </div>
      
        ${
          CreatedInvoice?.userId?.UID_Nummer
            ? ` <div>
        <span style="font-size: 10px !important;">UID-Nummer :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.UID_Nummer}</span>
        </div>`
            : ""
        }
        <div>
        <span style="font-size: 10px !important;">Firma :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.Firma}</span>
        </div>
        `
          break

        case "Verband,Verein":
          customerDetails = `
    ${
      CreatedInvoice?.userId?.Association
        ? ` <div>
        <span style="font-size: 10px !important;">Name Ihres Vereins :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.Association}</span>
        </div >`
        : ""
    }
                <div>
        <span style="font-size: 10px !important;">Obmann/Obfrau :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.chairman}</span>
        </div>
 
        <div >

        <span style="font-size: 10px !important;">Adresse :</span>
              <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

        </div>

        ${
          CreatedInvoice?.userId?.AssociationNumber
            ? ` <div>
        <span style="font-size: 10px !important;">Vereinsnummer :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.AssociationNumber}</span>
        </div>`
            : ""
        }
        `

          break

        default:
          break
      }
      sourcePdf = sourcePdf.replace("{{trbody}}", body)
      sourcePdf = sourcePdf.replace("{{Rechnungsnummer}}", CreatedInvoice?.invoiceId?.invoiceNumber)
      sourcePdf = sourcePdf.replace("{{Datum}}", moment(CreatedInvoice?.invoiceId?.createdAt).format("DD-MM-YYYY"))
      sourcePdf = sourcePdf.replace("{{customerDetails}}", customerDetails)
      sourcePdf = sourcePdf.replace("{{Address}}", CreatedInvoice.address)
      sourcePdf = sourcePdf.replace(
        "{{SummeNetto}}",
        (CreatedInvoice?.invoiceId?.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )
      sourcePdf = sourcePdf.replace(
        "{{SummeNetto1}}",
        (CreatedInvoice?.invoiceId?.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )

      sourcePdf = sourcePdf.replace(
        "{{Tax}}",
        (CreatedInvoice?.invoiceId?.totalPayment - CreatedInvoice?.invoiceId?.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )
      sourcePdf = sourcePdf.replace(
        "{{Total}}",
        CreatedInvoice?.invoiceId?.totalPayment.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )

      pdf.create(sourcePdf, options).toStream(async function (err, stream) {
        if (err) {
          console.log(err)
        }
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", "attachment; filename=Rechnung.pdf")
        stream.pipe(res)
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getPdfParams(req, res) {
    try {
      const CreatedInvoice = await CartService.model
        .findOne({
          userId: req.user._id,
          _id: req.params.id
        })
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
            path: "userId"
          },
          {
            path: "shippingAddress"
          },
          {
            path: "invoiceId"
          },
          {
            path: "shipment"
          }
        ])
        .lean()
      console.log("CreatedInvoice", CreatedInvoice)

      // createPdf
      const options = {
        format: "A4",
        footer: {
          height: "90px"
        }
      }
      const url = path.join(__dirname, "../../../../util/invoice/pdf.html")
      let sourcePdf = fs.readFileSync(url, "utf8")

      let body = ""
      const shipment = CreatedInvoice.shipment
      if (shipment.cost > 0) {
        const shipmentObject = {
          productName: "Versand",
          tableId: { count: 1, finalPrice: 12 }
        }
        CreatedInvoice.orderItems.push(shipmentObject)
      }

      CreatedInvoice.orderItems.map((order) => {
        body += `<tr>
        <td class="Beschreibung">
            <span>${order.productName}</span>

        </td>
        <td class="Menge">${order.tableId && order.tableId.count ? order.tableId.count : 1}</td>
        <td class="Preis">
        ${(order.tableId.finalPrice / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        €</td>
        <td class="Netto">
        ${order.tableId.finalPrice.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
        €</td>
    </tr>`
      })
      let customerDetails = ""
      switch (CreatedInvoice?.userId?.customertype) {
        case "Privatkunde":
          customerDetails = `<div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.gender === "Man" ? "Herr" : "Frau"} ${
            CreatedInvoice?.userId?.firstName
          } ${CreatedInvoice?.userId?.lastName}</span>
        </div>
    </div>
    <div >
      <span style="font-size: 10px !important;">Adresse :</span>
            <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

      </div>
    <div>
    </div>
    `
          break
        case "Busineskunde":
          customerDetails = `
             ${
               CreatedInvoice?.userId?.company
                 ? `<div>
      <span style="font-size: 10px !important;">Firma :</span>
      <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.company}</span>
      </div>`
                 : ""
             }
      ${
        CreatedInvoice?.userId?.firstName || CreatedInvoice?.userId?.lastName
          ? `     <div>
      <span style="font-size: 10px !important;">Name  :</span>
      <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.gender === "Man" ? "Herr" : "Frau"} ${CreatedInvoice?.userId?.firstName} ${
              CreatedInvoice?.userId?.lastName
            }</span>
      </div>`
          : `
        <div>
      <span style="font-size: 10px !important;">Liebe Kundin, lieber Kunde</span>
      </div>
        `
      }
      
      <div>
      <span style="font-size: 10px !important;">Adresse :</span>
                  <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

      </div>
      ${
        CreatedInvoice?.userId?.UID_Nummer
          ? ` <div>
      <span>UID-Nummer :</span>
      <span >${CreatedInvoice?.userId?.UID_Nummer}</span>
      </div>`
          : ""
      }
      `
          // <div>
          // <span>Branche :</span>
          // <span >${CreatedInvoice?.userId?.industry}</span>
          // </div>
          break

        case "Partner":
          customerDetails = `
        ${
          CreatedInvoice?.userId?.firstName || CreatedInvoice?.userId?.lastName
            ? `     <div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.gender === "Man" ? "Herr" : "Frau"} ${
                CreatedInvoice?.userId?.firstName
              } ${CreatedInvoice?.userId?.lastName}</span>
        </div>`
            : `
          <div>
        <span style="font-size: 10px !important;">Liebe Kundin, lieber Kunde</span>
        </div>
          `
        }
        <div>
        <span style="font-size: 10px !important;">Adresse :</span>
               <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

        </div>
        <span>Branche :</span>
        <span >${CreatedInvoice?.userId?.industry}</span>
        </div>
      
        ${
          CreatedInvoice?.userId?.UID_Nummer
            ? ` <div>
        <span style="font-size: 10px !important;">UID-Nummer :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.UID_Nummer}</span>
        </div>`
            : ""
        }
        <div>
        <span style="font-size: 10px !important;">Firma :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.Firma}</span>
        </div>
        `
          break

        case "Verband,Verein":
          customerDetails = `
    ${
      CreatedInvoice?.userId?.Association
        ? ` <div>
        <span style="font-size: 10px !important;">Name Ihres Vereins :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.Association}</span>
        </div>`
        : ""
    }
                <div>
        <span style="font-size: 10px !important;">Obmann/Obfrau :</span>
        <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.chairman}</span>
        </div>
   <div >

        <span style="font-size: 10px !important;">Adresse :</span>
              <span style="font-size: 10px !important;">${CreatedInvoice?.userId?.address}, ${CreatedInvoice?.userId?.postalCode}, ${
            CreatedInvoice?.userId?.city
          }, ${CreatedInvoice?.userId?.country}</span>

        </div>

        ${
          CreatedInvoice?.userId?.AssociationNumber
            ? ` <div>
        <span>Vereinsnummer :</span>
        <span >${CreatedInvoice?.userId?.AssociationNumber}</span>
        </div>`
            : ""
        }
        `

          break

        default:
          break
      }
      sourcePdf = sourcePdf.replace("{{trbody}}", body)
      sourcePdf = sourcePdf.replace("{{Rechnungsnummer}}", CreatedInvoice?.invoiceId?.invoiceNumber)
      sourcePdf = sourcePdf.replace("{{Datum}}", moment(CreatedInvoice?.invoiceId?.createdAt).format("DD-MM-YYYY"))
      sourcePdf = sourcePdf.replace("{{customerDetails}}", customerDetails)
      sourcePdf = sourcePdf.replace("{{Address}}", CreatedInvoice.address)
      sourcePdf = sourcePdf.replace(
        "{{SummeNetto}}",
        (CreatedInvoice?.invoiceId?.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )
      sourcePdf = sourcePdf.replace(
        "{{SummeNetto1}}",
        (CreatedInvoice?.invoiceId?.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )

      sourcePdf = sourcePdf.replace(
        "{{Tax}}",
        (CreatedInvoice?.invoiceId?.totalPayment - CreatedInvoice?.invoiceId?.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )
      sourcePdf = sourcePdf.replace(
        "{{Total}}",
        CreatedInvoice?.invoiceId?.totalPayment.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )

      pdf.create(sourcePdf, options).toStream(async function (err, stream) {
        if (err) {
          console.log(err)
        }
        res.setHeader("Content-Type", "application/pdf")
        res.setHeader("Content-Disposition", "attachment; filename=Rechnung.pdf")
        stream.pipe(res)
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async setShipmentCart(req, res) {
    try {
      const cart = await CartService.findOneByConditionAndPopulate(
        {
          userId: req.user._id,
          _id: req.params.cartId
        },

        {
          path: "orderItems",
          populate: {
            path: "tableId",
            populate: {
              path: "materialId"
            }
          }
        }
      )

      if (!cart) {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
        })
      }
      const ConstantShipment = await ConstantShipmentService.findOneByCondition({
        _id: req.body.shipmentId
      })

      if (!ConstantShipment) {
        return res.status(400).json({
          message: "Bitte wählen Sie eine Versandart. "
        })
      }

      if (ConstantShipment.name === "PICKUP") {
        const cartUpdate = await CartService.update(
          {
            _id: cart._id
          },
          {
            shipment: req.body.shipmentId,
            finalPrice: cart.finalPrice,
            shippingAddress: null
          },
          true
        )
        return res.status(200).json({
          data: CartView.transform(cartUpdate)
        })
      }
      if (!req.body.shippingAddress) {
        return res.status(400).json({
          data: {},
          message: "Bitte Versand-Adresse  hinzufügen"
        })
      }
      const shippingAddressObject = await AddressService.findOneByCondition({
        _id: req.body.shippingAddress
      })

      // console.log(String(shippingAddressObject.state).toLowerCase() !== "wien");
      if (
        !shippingAddressObject ||
        !shippingAddressObject?.state ||
        (ConstantShipment.name === "SENDING_BY_COURIER" && String(shippingAddressObject?.state).toLowerCase() !== "wien")
      ) {
        return res.status(400).json({
          data: {},
          message: "Bitte Versand-Adresse  hinzufügen"
        })
      }

      const shippingPrice = Number(cart.finalPrice) >= Number(ConstantShipment.freeAfterAmount) ? 0 : ConstantShipment.cost

      const updateObject = {
        shippingAddress: req.body.shippingAddress,
        billingAddress: req.body.billingAddress,
        finalPrice: !cart.shippingPrice ? Number(cart.finalPrice) + Number(shippingPrice) : cart.finalPrice,
        shippingPrice: shippingPrice,
        shipment: req.body.shipmentId
      }
      const cartUpdate = await CartService.update(
        {
          _id: cart._id
        },
        updateObject,
        true
      )

      return res.status(200).json({
        data: CartView.transform(cartUpdate)
      })
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
      const OrderStatus = await OrderStatusService.findAll({})

      return res.status(200).json({
        data: OrderStatus
      })
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
      const ReservedStatus = await OrderStatusService.findOneByCondition({
        key: "Reserved"
      })
      const currentCart = await CartService.model
        .findOne({
          userId: req.user._id,
          statusId: ReservedStatus._id
        })
        .populate({ path: "orderItems", populate: { path: "tableId" } })
      if (!currentCart) {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
        })
      }

      const session = await createPaymentIntent(currentCart)
      if (!session) {
        return res.status(400).json({
          message: "stripe problem"
        })
      }

      const paymentRecord = await PaymentService.CreatePayment(req.user._id, session, currentCart._id)
      if (!paymentRecord) {
        return res.status(402).json({
          data: ""
        })
      }
      await CartService.update(
        {
          _id: currentCart._id
        },
        {
          statusCode: 100,
          statusName: "payment_processing"
        }
      )

      return res.status(200).json({
        data: PaymentView.transform({ ...paymentRecord._doc, amount: currentCart.finalPrice })
      })
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async verify(req, res) {
    const declineHtml = await htmlAddress("failWeb.html")
    const successHtml = await htmlAddress("succsWeb.html")
    try {
      const { session_id } = req.query
      if (!session_id) {
        return res.send(declineHtml)
      }

      const session = await sessionRetriever(session_id, declineHtml)
      if (!session) {
        res.setHeader("Content-Type", "text/html")
        res.type("html")
        res.sendFile(declineHtml)
        return
      }
      const paymentRecord = await PaymentService.findOneByCondition({ sessionId: session_id })

      if (!paymentRecord) {
        res.status(402).json({
          data: ""
        })
        res.type("html")
        res.sendFile(declineHtml)
        return
      }
      const cart = await CartService.findOneByConditionAndPopulate(
        {
          _id: paymentRecord.cartId
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
      const SubmittedStatus = await OrderStatusService.findOneByCondition({
        key: "Submitted"
      })
      await CartService.update(
        {
          _id: paymentRecord.cartId
        },
        {
          statusId: SubmittedStatus._id,
          paymentType: "Stripe"
        }
      )
      const createdInvoice = await InvoiceService.CreateInovice(cart, cart.finalPrice)
      await CartService.update(
        {
          _id: paymentRecord.cartId
        },
        {
          invoiceId: createdInvoice._id
        }
      )

      await sendBillNew({ ...cart._doc, paymentType: "Stripe" })
      res.setHeader("Content-Type", "text/html")
      res.type("html")
      return res.sendFile(successHtml)
    } catch (err) {
      GeneralPanel.error(err)

      res.setHeader("Content-Type", "text/html")
      res.type("html")
      return res.sendFile(declineHtml)
    }
  }
  async paypalStart(req, res) {
    try {
      const ReservedStatus = await OrderStatusService.findOneByCondition({
        key: "Reserved"
      })
      const correntCart = await CartService.findOneByCondition({
        userId: req.user._id,
        statusId: ReservedStatus._id
      })
      if (!correntCart) {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
        })
      }

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
      const UserId = req.user._id
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
        const { id, cartId } = req.body
        const configGetData = {
          method: "get",
          url: `${BasicPayPalUrl}/v2/payments/captures/${id}`,

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`
          }
        }

        const { data } = await axios(configGetData)
        if (String(data.status) === "COMPLETED") {
          const cart = await CartService.findOneByConditionAndPopulate(
            {
              _id: cartId
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
          const SubmittedStatus = await OrderStatusService.findOneByCondition({
            key: "Submitted"
          })
          await CartService.update(
            {
              _id: cartId
            },
            {
              statusId: SubmittedStatus._id,
              paymentType: "Paypal"
            }
          )

          const createdInvoice = await InvoiceService.CreateInovice(cart, cart.finalPrice)

          await CartService.update(
            {
              _id: cartId
            },
            {
              invoiceId: createdInvoice._id
            }
          )

          await sendBillNew({ ...cart._doc, paymentType: "Paypal" })

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

      const cart = await CartService.findOneByConditionAndPopulate(
        {
          _id: existClientSecret.cartId
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
          }
        ]
      )
      await PaymentService.update({ _id: existClientSecret._id }, { statusCode: 200 })

      await CartService.update(
        {
          _id: cart._id
        },
        {
          statusCode: 200,
          statusName: "submitted"
        }
      )

      const createdInvoice = await InvoiceService.CreateInovice(cart, Number(object.amount) / 100)

      await sendBill(cart)

      return res.send()
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
    // Return a 200 response to acknowledge receipt of the event
  }

  async spotPayment(req, res) {
    try {
      let ReservedStatus = await OrderStatusService.findOneByCondition({
        key: "Reserved"
      })
      const cart = await CartService.findOneByConditionAndPopulate(
        {
          userId: req.user._id,
          statusId: ReservedStatus._id
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
      if (!cart) {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
        })
      }
      const SubmittedStatus = await OrderStatusService.findOneByCondition({
        key: "Submitted"
      })
      await CartService.update(
        {
          _id: cart._id
        },
        {
          statusId: SubmittedStatus._id,
          paymentType: "Zahlung_vor_Ort"
        }
      )

      await spotPaymentSend({ ...cart._doc, paymentType: "Zahlung_vor_Ort" })

      return res.send()
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
    // Return a 200 response to acknowledge receipt of the event
  }

  async getAllsubmitted(req, res) {
    try {
      const SubmittedStatus = await OrderStatusService.findOneByCondition({
        key: "Submitted"
      })
      const carts = await CartService.findAllAndPopulate(
        {
          userId: req.user._id,
          statusId: SubmittedStatus._id
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
          }
        ]
      )

      if (carts && carts.length) {
        return res.status(200).json({
          data: CartView.transformCollection(carts)
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
      const CompletedStatus = await OrderStatusService.findOneByCondition({
        key: "Completed"
      })
      const carts = await CartService.findAllAndPopulate(
        {
          userId: req.user._id,
          statusId: CompletedStatus._id
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
          }
        ]
      )

      if (carts && carts.length) {
        return res.status(200).json({
          data: CartView.transformCollection(carts)
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
  async getAllFilter(req, res) {
    try {
      const { statusCode } = req.body

      const carts = await CartService.findAllAndPopulate(
        {
          userId: req.user._id,
          ...(statusCode
            ? {
                statusCode: statusCode
              }
            : {})
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
            path: "invoiceId"
          }
        ]
      )
      if (carts && carts.length) {
        return res.status(200).json({
          data: CartView.transformCollection(carts)
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

  async getAllSearch(req, res) {
    try {
      const { page, limit, sort, condition } = req.body
      const ReservedStatus = await OrderStatusService.findOneByCondition({ key: "Reserved" })
      const newCondition = { statusId: { $ne: ReservedStatus._id }, userId: req.user._id, ...condition }
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
      const newCondition = { statusId: { $ne: ReservedStatus._id }, userId: req.user._id, ...condition }
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
      const cart = await CartService.findOneByCondition(
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
          }
        ]
      )
      if (cart) {
        return res.status(200).json({
          data: CartView.transform(cart)
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
      const ordersItem = await OrderService.findOneByConditionAndPopulate(
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
      const foundCart = await CartService.findOneByCondition({ orderItems: req.params.id, userId: req.user._id })
      const newOrderItems = foundCart.orderItems.filter((item) => String(item) !== String(req.params.id))
      if (newOrderItems && newOrderItems.length) {
        const newFoundCart = {
          orderItems: newOrderItems,
          finalPrice: Number(foundCart.finalPrice) - Number(ordersItem.tableId.finalPrice)
        }
        await CartService.update({ _id: foundCart._id }, newFoundCart)
      } else {
        await CartService.hardDelete({
          _id: foundCart._id
        })
      }

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

  async DeleteCart(req, res) {
    try {
      const cart = await CartService.hardDelete({
        _id: req.params.id,
        userId: req.user._id
      })
      if (cart) {
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
      const { id } = req.body
      const cart = await CartService.findOneByConditionAndPopulate(
        {
          _id: id
        },

        {
          path: "orderItems",
          populate: {
            path: "tableId",
            populate: {
              path: "materialId"
            }
          }
        }
      )
      const createdInvoice = await InvoiceService.CreateInoviceTest(cart, Number(cart.finalPrice))
      await sendBill(cart)

      return res.send()
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`)
      return
    }
    // Return a 200 response to acknowledge receipt of the event
  }
})()

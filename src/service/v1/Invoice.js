/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/Invoice")
const UserService = require("./User")
const moment = require("moment")
const path = require("path")
const fs = require("fs")
const handlebars = require("handlebars")
const { sendMail } = require("../../util/nodeMailer")
const pdf = require("html-pdf")

module.exports = new (class serviceModel extends BaseService {
  async InvoiceNumber() {
    const alex = moment().format("YYMMDD")
    const findLastOrderNumber = await this.findOneByConditionBySort({ invoiceNumber: { $regex: alex } }, "-createdAt")
    return findLastOrderNumber ? String(Number(findLastOrderNumber.invoiceNumber) + 1) : String(alex) + "01"
  }

  async CreateInovice(cart, total) {
    try {
      const { orderItems, userId, shippingAddress } = cart
      const InvoiceNumber = await this.InvoiceNumber()
      const OrderItemIds = orderItems.map((orderItem) => {
        return orderItem._id
      })
      const ObjectInvoice = {
        orderIds: OrderItemIds,
        invoiceNumber: InvoiceNumber,
        phoneNumber: userId.phoneNumber,
        email: userId.email,
        userId: userId && userId._id ? userId._id : null,
        totalPayment: total,
        tax: total - Math.floor(total / 1.2),
        subTotal: Math.floor(total / 1.2),
        customertype: userId.customertype,
        firstName: userId.firstName,
        lastName: userId.lastName,
        postalCode: userId.postalCode,
        country: userId.country,
        gender: userId.gender,
        address: userId.address,
        city: userId.city,
        shipment: shippingAddress?.shipment,
        company: userId.company,
        industry: userId.industry,
        UID_Nummer: userId.UID_Nummer,
        Association: userId.Association,
        AssociationNumber: userId.AssociationNumber,
        chairman: userId.chairman
      }
      const CreatedObject = await this.createObject(ObjectInvoice)

      if (!CreatedObject) {
        return
      }
      const CreatedInvoice = await this.model
        .findOne({ _id: CreatedObject._id })
        .populate({
          path: "orderIds",
          populate: { path: "tableId", populate: { path: "materialId" } }
        })
        .lean()
      const source = fs.readFileSync(path.join(__dirname, "../../util/invoice/index.handlebars"), "utf8")
      // const sourcePdf = fs.readFileSync(
      //   path.join(__dirname, "../../util/invoice/pdf.handlebars"),
      //   "utf8",
      // );

      // createPdf
      const options = {
        format: "A4",
        footer: {
          height: "90px"
        }
      }
      const url = path.join(__dirname, "../../util/invoice/pdf.html")
      let sourcePdf = fs.readFileSync(url, "utf8")

      let body = ""
      const shipment = cart.shipment
      if (shipment.cost > 0) {
        const shipmentObject = {
          productName: "Versand",
          tableId: { count: 1, finalPrice: 12 }
        }
        CreatedInvoice.orderIds.push(shipmentObject)
      }

      CreatedInvoice.orderIds.map((order) => {
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
      switch (ObjectInvoice.customertype) {
        case "Privatkunde":
          customerDetails = `<div>
          <span style="font-size: 10px !important;">Name  :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.gender === "Man" ? "Herr" : "Frau"} ${ObjectInvoice.firstName} ${
            ObjectInvoice.lastName
          }</span>
          </div>
      </div>
      <div>
        <span style="font-size: 10px !important;">Adresse :</span>
              <span style="font-size: 10px !important;">${ObjectInvoice.address}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.city}, ${
            ObjectInvoice.country
          }</span>
  
        </div>
      <div>
      </div>
      `
          break
        case "Busineskunde":
          customerDetails = `
               ${
                 ObjectInvoice?.company
                   ? `<div>
        <span style="font-size: 10px !important;">Firma :</span>
        <span style="font-size: 10px !important;">${ObjectInvoice.company}</span>
        </div>`
                   : ""
               }
        ${
          ObjectInvoice.firstName || ObjectInvoice.lastName
            ? `     <div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${ObjectInvoice.gender === "Man" ? "Herr" : "Frau"} ${ObjectInvoice.firstName} ${
                ObjectInvoice.lastName
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
                    <span style="font-size: 10px !important;">${ObjectInvoice.address}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.city}, ${
            ObjectInvoice.country
          }</span>
  
        </div>
        ${
          ObjectInvoice.UID_Nummer
            ? ` <div>
        <span style="font-size: 10px !important;">UID-Nummer :</span>
        <span style="font-size: 10px !important;">${ObjectInvoice.UID_Nummer}</span>
        </div>`
            : ""
        }
        `
          // <div>
          // <span>Branche :</span>
          // <span >${ObjectInvoice.industry}</span>
          // </div>
          break

        case "Partner":
          customerDetails = `
          ${
            ObjectInvoice.firstName || ObjectInvoice.lastName
              ? `     <div>
          <span style="font-size: 10px !important;">Name  :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.gender === "Man" ? "Herr" : "Frau"} ${ObjectInvoice.firstName} ${
                  ObjectInvoice.lastName
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
                 <span style="font-size: 10px !important;">${ObjectInvoice.address}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.city}, ${
            ObjectInvoice.country
          }</span>
  
          </div>
          <span style="font-size: 10px !important;">Branche :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.industry}</span>
          </div>
        
          ${
            ObjectInvoice.UID_Nummer
              ? ` <div>
          <span style="font-size: 10px !important;">UID-Nummer :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.UID_Nummer}</span>
          </div>`
              : ""
          }
          <div>
          <span style="font-size: 10px !important;">Firma :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.Firma}</span>
          </div>
          `
          break

        case "Verband,Verein":
          customerDetails = `
      ${
        ObjectInvoice.Association
          ? ` <div>
          <span style="font-size: 10px !important;">Name Ihres Vereins :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.Association}</span>
          </div>`
          : ""
      }
                  <div>
          <span style="font-size: 10px !important;">Obmann/Obfrau :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.chairman}</span>
          </div>
   <div >

        <span style="font-size: 10px !important;">Adresse :</span>
                <span style="font-size: 10px !important;">${ObjectInvoice.address}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.city}, ${
            ObjectInvoice.country
          }</span>
  
          </div>
  
          ${
            ObjectInvoice.AssociationNumber
              ? ` <div>
          <span style="font-size: 10px !important;">Vereinsnummer :</span>
          <span style="font-size: 10px !important;">${ObjectInvoice.AssociationNumber}</span>
          </div>`
              : ""
          }
          `

          break

        default:
          break
      }
      sourcePdf = sourcePdf.replace("{{trbody}}", body)
      sourcePdf = sourcePdf.replace("{{Rechnungsnummer}}", CreatedInvoice.invoiceNumber)
      sourcePdf = sourcePdf.replace("{{Datum}}", moment(CreatedInvoice.createdAt).format("DD-MM-YYYY"))
      sourcePdf = sourcePdf.replace("{{customerDetails}}", customerDetails)
      sourcePdf = sourcePdf.replace("{{Address}}", CreatedInvoice.address)
      sourcePdf = sourcePdf.replace(
        "{{SummeNetto}}",
        (CreatedInvoice.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )
      sourcePdf = sourcePdf.replace(
        "{{SummeNetto1}}",
        (CreatedInvoice.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )

      sourcePdf = sourcePdf.replace(
        "{{Tax}}",
        (CreatedInvoice.totalPayment - CreatedInvoice.totalPayment / 1.2).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )
      sourcePdf = sourcePdf.replace(
        "{{Total}}",
        CreatedInvoice.totalPayment.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      )

      const Html = handlebars.compile(source)
      const attactment = [
        {
          filename: "TelePrintlogorgb.png",
          path: path.join(__dirname, "../../util/staticGallery/TelePrintlogorgb.png"),
          cid: "logo"
        }
      ]
      const pdfName = `Rechnung${Date.now()}.pdf`

      pdf.create(sourcePdf, options).toFile(`./pdf/${pdfName}`, async function (err, respanse) {
        if (err) {
          console.log(err)
        }
        const pdfPath = path.join(__dirname, `../../../pdf/${pdfName}`)
        const pdfAttachment = {
          filename: pdfName,
          path: pdfPath,
          cid: "bill"
        }
        attactment.push(pdfAttachment)

        await sendMail(
          ObjectInvoice.email,

          `Thanks for choosing us Rechnungsnummer R-${CreatedInvoice.invoiceNumber}`,
          Html(
            {
              ...CreatedInvoice,
              address: `${ObjectInvoice.country}, ${ObjectInvoice.address}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.street}`,
              createdAt: moment(CreatedInvoice.createdAt).format("DD-MM-YYYY")
            },
            {
              allowedProtoMethods: {
                trim: true
              }
            }
          ),
          attactment
        )
        await sendMail(
          "print@teleprint.at",
          `you have Order Rechnungsnummer R-${CreatedInvoice.invoiceNumber}`,
          Html(
            {
              ...CreatedInvoice,
              address: `${ObjectInvoice.address}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.city}, ${ObjectInvoice.country}`,
              createdAt: moment(CreatedInvoice.createdAt).format("DD-MM-YYYY")
            },
            {
              allowedProtoMethods: {
                trim: true
              }
            }
          ),
          attactment
        )
        // return res.status(200).json({ data: respanse });
        // { filename: '/app/businesscard.pdf' }
      })

      return CreatedInvoice
    } catch (error) {
      console.error(error)
      return
    }
  }

  async CreateInoviceTest(cart, total) {
    const { orderItems, userId } = cart
    const InvoiceNumber = await this.InvoiceNumber()

    const OrderItemIds = orderItems.map((orderItem) => {
      return orderItem._id
    })

    const ObjectInvoice = {
      orderIds: OrderItemIds,
      invoiceNumber: InvoiceNumber,
      phoneNumber: userId.phoneNumber,
      email: userId.email,
      userId: userId && userId._id ? userId._id : null,
      totalPayment: total,
      tax: Math.floor(total * 0.2),
      subTotal: total - Math.floor(total * 0.2),
      customertype: userId.customertype,
      firstName: userId.firstName,
      lastName: userId.lastName,
      postalCode: userId.postalCode,
      country: userId.country,
      gender: userId.gender,
      address: userId.address,
      street: userId.street,
      shipment: userId.shipment,
      company: userId.company,
      industry: userId.industry,
      UID_Nummer: userId.UID_Nummer,
      Association: userId.Association,
      AssociationNumber: userId.AssociationNumber,
      chairman: userId.chairman
    }

    const CreatedObject = await this.createObject(ObjectInvoice)

    if (!CreatedObject) {
      return
    }
    const CreatedInvoice = await this.model
      .findOne({ _id: CreatedObject._id })
      .populate({
        path: "orderIds",
        populate: { path: "tableId", populate: { path: "materialId" } }
      })
      .lean()
    const source = fs.readFileSync(path.join(__dirname, "../../util/invoice/index.handlebars"), "utf8")
    // const sourcePdf = fs.readFileSync(
    //   path.join(__dirname, "../../util/invoice/pdf.handlebars"),
    //   "utf8",
    // );

    // createPdf
    const options = {
      format: "A4",
      footer: {
        height: "160px"
      },
      header: {
        height: "180px"
      }
    }
    const url = path.join(__dirname, "../../util/invoice/pdf.html")
    let sourcePdf = fs.readFileSync(url, "utf8")

    let body = ""
    CreatedInvoice.orderIds.map((order) => {
      body += `<tr>
        <td class="Beschreibung">
            <span>${order.productName}</span>

        </td>
        <td class="Menge">${order.tableId && order.tableId.count ? order.tableId.count : 1}</td>
        <td class="Preis">
        ${(order.tableId.finalPrice * 0.8).toLocaleString(undefined, {
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
    switch (ObjectInvoice.customertype) {
      case "Privatkunde":
        customerDetails = `<div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${ObjectInvoice.gender === "Man" ? "Herr" : "Frau"} ${ObjectInvoice.firstName} ${
          ObjectInvoice.lastName
        }</span>
        </div>
    </div>
    <div >
      <span style="font-size: 10px !important;">Adresse :</span>
            <span style="font-size: 10px !important;">${ObjectInvoice.street}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.state}, ${
          ObjectInvoice.country
        }</span>

      </div>
    <div>
    </div>
    `
        break
      case "Busineskunde":
        customerDetails = `
      ${
        ObjectInvoice.firstName || ObjectInvoice.lastName
          ? `     <div>
      <span style="font-size: 10px !important;">Name  :</span>
      <span style="font-size: 10px !important;">${ObjectInvoice.gender === "Man" ? "Herr" : "Frau"} ${ObjectInvoice.firstName} ${
              ObjectInvoice.lastName
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
            <span style="font-size: 10px !important;">${ObjectInvoice.street}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.state}, ${
          ObjectInvoice.country
        }</span>

      </div>
      <div>
      <span>Branche :</span>
      <span >${ObjectInvoice.industry}</span>
      </div>
      ${
        ObjectInvoice.UID_Nummer
          ? ` <div>
      <span>UID-Nummer :</span>
      <span >${ObjectInvoice.UID_Nummer}</span>
      </div>`
          : ""
      }
      <div>
      <span style="font-size: 10px !important;">Firma :</span>
      <span style="font-size: 10px !important;">${ObjectInvoice.Firma}</span>
      </div>
      `
        break

      case "Partner":
        customerDetails = `
        ${
          ObjectInvoice.firstName || ObjectInvoice.lastName
            ? `     <div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${ObjectInvoice.gender === "Man" ? "Herr" : "Frau"} ${ObjectInvoice.firstName} ${
                ObjectInvoice.lastName
              }</span>
        </div>`
            : `
          <div>
        <span>Liebe Kundin, lieber Kunde</span>
        </div>
          `
        }
        <div>
        <span style="font-size: 10px !important;">Adresse :</span>
              <span style="font-size: 10px !important;">${ObjectInvoice.street}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.state}, ${
          ObjectInvoice.country
        }</span>

        </div>
        <span>Branche :</span>
        <span >${ObjectInvoice.industry}</span>
        </div>
      
        ${
          ObjectInvoice.UID_Nummer
            ? ` <div>
        <span>UID-Nummer :</span>
        <span >${ObjectInvoice.UID_Nummer}</span>
        </div>`
            : ""
        }
        <div>
        <span style="font-size: 10px !important;">Firma :</span>
        <span style="font-size: 10px !important;">${ObjectInvoice.Firma}</span>
        </div>
        `
        break

      case "Verband,Verein":
        customerDetails = `
        ${
          ObjectInvoice.firstName || ObjectInvoice.lastName
            ? `     <div>
        <span style="font-size: 10px !important;">Name  :</span>
        <span style="font-size: 10px !important;">${ObjectInvoice.gender === "Man" ? "Herr" : "Frau"} ${ObjectInvoice.firstName} ${
                ObjectInvoice.lastName
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
              <span style="font-size: 10px !important;">${ObjectInvoice.street}, ${ObjectInvoice.postalCode}, ${ObjectInvoice.state}, ${
          ObjectInvoice.country
        }</span>

        </div>

        ${
          ObjectInvoice.AssociationNumber
            ? ` <div>
        <span>Vereinsnummer :</span>
        <span >${ObjectInvoice.AssociationNumber}</span>
        </div>`
            : ""
        }
        ${
          ObjectInvoice.Vereinsnummer
            ? ` <div>
        <span>Name Ihres Vereins :</span>
        <span >${ObjectInvoice.Association}</span>
        </div>`
            : ""
        }
        <div>
        <span>Obmann/Obfrau :</span>
        <span >${ObjectInvoice.chairman}</span>
        </div>
        `

        break

      default:
        break
    }
    sourcePdf = sourcePdf.replace("{{trbody}}", body)
    sourcePdf = sourcePdf.replace("{{Rechnungsnummer}}", CreatedInvoice.invoiceNumber)
    sourcePdf = sourcePdf.replace("{{Datum}}", moment(CreatedInvoice.createdAt).format("DD-MM-YYYY"))
    sourcePdf = sourcePdf.replace("{{customerDetails}}", customerDetails)
    sourcePdf = sourcePdf.replace("{{Address}}", CreatedInvoice.address)
    sourcePdf = sourcePdf.replace(
      "{{SummeNetto}}",
      (CreatedInvoice.totalPayment * 0.8).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    )
    sourcePdf = sourcePdf.replace(
      "{{SummeNetto1}}",
      (CreatedInvoice.totalPayment * 0.8).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    )

    sourcePdf = sourcePdf.replace(
      "{{Tax}}",
      (CreatedInvoice.totalPayment * 0.2).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    )
    sourcePdf = sourcePdf.replace(
      "{{Total}}",
      CreatedInvoice.totalPayment.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    )

    const Html = handlebars.compile(source)

    const attactment = [
      {
        filename: "TelePrintlogorgb.png",
        path: path.join(__dirname, "../../util/staticGallery/TelePrintlogorgb.png"),
        cid: "logo"
      }
    ]
    const pdfName = `Rechnung${Date.now()}.pdf`
    pdf.create(sourcePdf, options).toFile(`./pdf/${pdfName}`, async function (err, respanse) {
      if (err) {
        console.log(err)
      }
      const pdfPath = path.join(__dirname, `../../../pdf/${pdfName}`)
      const pdfAttachment = {
        filename: pdfName,
        path: pdfPath,
        cid: "bill"
      }
      attactment.push(pdfAttachment)
      await sendMail(
        ObjectInvoice.email,

        `Thanks for choosing us`,
        Html(
          {
            ...CreatedInvoice,
            createdAt: moment(CreatedInvoice.createdAt).format("DD-MM-YYYY")
          },
          {
            allowedProtoMethods: {
              trim: true
            }
          }
        ),
        attactment
      )
      await sendMail(
        "print@teleprint.at",
        `you have Order`,
        Html(
          {
            ...CreatedInvoice,
            createdAt: moment(CreatedInvoice.createdAt).format("DD-MM-YYYY")
          },
          {
            allowedProtoMethods: {
              trim: true
            }
          }
        ),
        attactment
      )
      // return res.status(200).json({ data: respanse });
      // { filename: '/app/businesscard.pdf' }
    })

    return CreatedInvoice
  }
})(Model)

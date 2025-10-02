/** @format */

const nodemailer = require("nodemailer")
const { PaymentIntent } = require("../log")
const { EmailAddress, Host, Password, Port, ReplyEmailAddress } = require("../config/nodemailer")
const ejs = require("ejs")
const path = require("path")

const { BASE_URL_FOR_MULTER } = require("../config")
// const pdf = require("pdf-creator-node");
const nodemailerObject = {
  name: EmailAddress,
  pool: true,
  host: Host,
  port: Port,
  secure: true, // use SSL
  auth: {
    user: EmailAddress,
    pass: Password
  },
  from: EmailAddress,
  tls: {
    rejectUnauthorized: false
  }
}
const tranporter = nodemailer.createTransport(nodemailerObject)
console.log(nodemailerObject)
async function sendMail(to, subject, html, attactment) {
  const mailOption = {
    from: EmailAddress,
    to: to,
    replyTo: ReplyEmailAddress,
    subject: subject,
    html: html,
    attachments: attactment
  }

  tranporter.sendMail(mailOption, function (err, data) {
    if (err) {
      PaymentIntent.error({ err: err })
    } else {
      PaymentIntent.debug({ sucess: "its done", data })
      return data
    }
  })
}
async function SendProductList(order) {
  try {
    if (!order) {
      res.status(400).json({ message: "order is wrong" })
      return
    }
    const { userId } = order
    const templateAddress = path.join(__dirname, "/invoice", "/productList.ejs")
    console.log("order", order)
    const renderedTemplate = await ejs.renderFile(templateAddress, order)

    await sendMail("print@teleprint.at", `you have Order`, renderedTemplate)
    await sendMail(userId.email, `Thanks for choosing us`, renderedTemplate)
    return
  } catch (err) {
    console.log(err)
  }
}

async function ChangeStatus(order) {
  try {
    if (!order) {
      res.status(400).json({ message: "order is wrong" })
      return
    }
    const { userId } = order
    const templateAddress = path.join(__dirname, "/invoice", "/index.ejs")
    const renderedTemplate = await ejs.renderFile(templateAddress, order)

    await sendMail(userId.email, `Your order state has been changed`, renderedTemplate)
    return
  } catch (err) {
    console.log(err)
  }
}
async function sendSimpleEmail(to, subject, text, res) {
  const mailOption = {
    from: EmailAddress,
    to: to,
    subject: subject,
    replyTo: ReplyEmailAddress,

    text
  }

  tranporter.sendMail(mailOption, function (err, data) {
    if (err) {
      PaymentIntent.error({ err: err })
    } else {
      PaymentIntent.debug({ sucess: "its done", data })
      if (res) {
        return res.status(200).json({
          data: {
            ...data,
            expireInSeconds: 300
          },
          message: "کد ورود شما ارسال شد"
        })
      }
    }
  })
}

async function sendBill(Orders) {
  const attactment = [
    {
      filename: "TelePrintlogorgb.png",
      path: __dirname + "/staticGallery/TelePrintlogorgb.png",
      cid: "logo"
    }
  ]
  let Html = ""
  switch (Orders[0].customertype) {
    case "Busineskunde":
      Html = `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>tele.inline</title>
      <style>
  .flex_dirction{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
          body {
              color: black;
          }
  
          table {
              width: 100%;
              border-spacing: 0;
              border: 1px solid black;
              color: black;
          }
  
          td {
              text-align: center;
              border-right: 0.1px solid black;
              font-size: 16px;
          }
      </style>
  </head>
  
  <body>
  <div>
  <div style="width:90%">


      <div style=" margin-top: 20px">
      Vielen Dank für Ihre Bestellung.
     </div>
      <div style="margin-top: 10px;">
          Ihre Bestellung lautet:
      </div>
  </div>
</div>

      ${Orders.map(
        (orderItem, i) => `   
          <ul>
          <h4>
          ${orderItem.productName}
          </h4>
          <h4>
          ${Orders.firstName && Orders.firstName + " " + Orders.lastName && Orders.lastName}
      </h4>
          <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
          <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>

          <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
          <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
          <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
          <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
          <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt.</li>
          <li> email: ${orderItem.email}</li>
          <li> Telefonnummer: ${orderItem.phoneNumber}</li> 
                   <li> Beschreibung: ${orderItem.description}</li>
          <li> Kundentyp: ${orderItem.customertype}</li>
          <li> PLZ: ${orderItem.postalCode}</li>
          <li> Land: ${orderItem.country}</li>
          <li> Ort: ${orderItem.address}</li>
          <li> Straße & Hausnummer: ${orderItem.street}</li>
          <li> shipment: ${orderItem.shipment}</li>
          <li> Branche: ${orderItem.industry}</li>
          <li> UID_Nummer: ${orderItem.UID_Nummer}</li>
          <li> Firma: ${orderItem.company}</li>
          <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>
          ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
      </ul>`
      )}
       <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
  </div>
  </body>
  </html>
  
  `
      break

    case "Partner":
      Html = `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>tele.inline</title>
      <style>
  .flex_dirction{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
          body {
              color: black;
          }
  
          table {
              width: 100%;
              border-spacing: 0;
              border: 1px solid black;
              color: black;
          }
  
          td {
              text-align: center;
              border-right: 0.1px solid black;
              font-size: 16px;
          }
      </style>
  </head>
  
  <body>
  <div>
  <div style="width:90%">


      <div style=" margin-top: 20px">
      Vielen Dank für Ihre Bestellung.
     </div>
      <div style="margin-top: 10px;">
          Ihre Bestellung lautet:
      </div>
  </div>
</div>

      ${Orders.map(
        (orderItem, i) => `   
          <ul>
          <h4>
          ${orderItem.productName}
          </h4>
          <h4>
          ${Orders.firstName && Orders.firstName + " " + Orders.lastName && Orders.lastName}
      </h4>
          <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
          <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>

          <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
          <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
          <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
          <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
          <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt.</li>
          <li> email: ${orderItem.email}</li>
          <li> Telefonnummer: ${orderItem.phoneNumber}</li> 
          <li> Beschreibung: ${orderItem.description}</li>
          <li> Kundentyp: ${orderItem.customertype}</li>
          <li> PLZ: ${orderItem.postalCode}</li>
          <li> Land: ${orderItem.country}</li>
          <li> Ort: ${orderItem.address}</li>
          <li> Straße & Hausnummer: ${orderItem.street}</li>
          <li> shipment: ${orderItem.shipment}</li>
          <li> Branche: ${orderItem.industry}</li>
          <li> UID_Nummer: ${orderItem.UID_Nummer}</li>
          <li> Firma: ${orderItem.company}</li>
          <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>
          ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
      </ul>`
      )}
       <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
  </div>
  </body>
  </html>
  
  `
      break

    case "Verband,Verein":
      Html = `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>tele.inline</title>
      <style>
  .flex_dirction{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
          body {
              color: black;
          }
  
          table {
              width: 100%;
              border-spacing: 0;
              border: 1px solid black;
              color: black;
          }
  
          td {
              text-align: center;
              border-right: 0.1px solid black;
              font-size: 16px;
          }
      </style>
  </head>
  
  <body>
  <div>
  <div style="width:90%">
      <div style=" margin-top: 20px">
      Vielen Dank für Ihre Bestellung.
     </div>
      <div style="margin-top: 10px;">
          Ihre Bestellung lautet:
      </div>
  </div>
</div>

      ${Orders.map(
        (orderItem, i) => `   
          <ul>
          <h4>
          ${Orders.firstName && Orders.firstName + " " + Orders.lastName && Orders.lastName}
      </h4>
          <h4>
          ${orderItem.productName}
          </h4>
          <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
          <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>

          <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
          <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
          <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
          <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
          <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt.</li>
          <li> email: ${orderItem.email}</li>
          <li> Telefonnummer: ${orderItem.phoneNumber}</li> 
          <li> Beschreibung: ${orderItem.description}</li>
          <li> Kundentyp: ${orderItem.customertype}</li>
          <li> PLZ: ${orderItem.postalCode}</li>
          <li> Land: ${orderItem.country}</li>
          <li> Ort: ${orderItem.address}</li>
          <li> Straße & Hausnummer: ${orderItem.street}</li>
          <li> shipment: ${orderItem.shipment}</li>
          <li> Name Ihres Vereins: ${orderItem.Association}</li>
          <li> Vereinsnummer: ${orderItem.AssociationNumber}</li>
          <li> Obmann/Obfrau: ${orderItem.chairman}</li>
          <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>
          ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
      </ul>`
      )}
       <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
  </div>
  </body>
  </html>
  
  `
      break

    default:
      Html = `
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>tele.inline</title>
      <style>
  .flex_dirction{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  
          body {
              color: black;
          }
  
          table {
              width: 100%;
              border-spacing: 0;
              border: 1px solid black;
              color: black;
          }
  
          td {
              text-align: center;
              border-right: 0.1px solid black;
              font-size: 16px;
          }
      </style>
  </head>
  
  <body>
  <div>
  <div style="width:90%">

      <div style=" margin-top: 20px">
      Vielen Dank für Ihre Bestellung.
     </div>
      <div style="margin-top: 10px;">
          Ihre Bestellung lautet:
      </div>
  </div>
</div>

      ${Orders.map(
        (orderItem, i) => `   
          <ul>
          <h4>
          ${orderItem.productName}
          </h4>
          <h4>
          ${orderItem.firstName + " " + orderItem.lastName}
      </h4>
          <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
          <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>

          <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
          <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
          <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
          <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
          <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt.</li>
          <li> email: ${orderItem.email}</li>
          <li> Telefonnummer: ${orderItem.phoneNumber}</li> 
          <li> Beschreibung: ${orderItem.description}</li>
          <li> Kundentyp: ${orderItem.customertype}</li>
          <li> PLZ: ${orderItem.postalCode}</li>
          <li> Land: ${orderItem.country}</li>
          <li> Ort: ${orderItem.address}</li>
          <li> Straße & Hausnummer: ${orderItem.street}</li>
          <li> shipment: ${orderItem.shipment}</li>
          ${orderItem?.tableId?.file1 ? ` <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>` : ""}
          ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
      </ul>`
      )}
       <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
  </div>
  </body>
  </html>
  
  `
      break
  }

  await sendMail("print@teleprint.at", `you have Order`, Html, attactment)

  await sendMail(Orders[0].email, `Thanks for choosing us`, Html, attactment)
  return
}

async function sendBillNew(cart) {
  SendProductList(cart)

  return
}

async function spotPaymentSend(cart) {
  const { orderItems, userId, shippingAddress, shipment } = cart
  SendProductList(cart)
  return
  const attactment = [
    {
      filename: "TelePrintlogorgb.png",
      path: __dirname + "/staticGallery/TelePrintlogorgb.png",
      cid: "logo"
    }
  ]
  let Html = ""
  switch (userId?.customertype) {
    case "Busineskunde":
      Html = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>tele.inline</title>
        <style>
    .flex_dirction{
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    
            body {
                color: black;
            }
    
            table {
                width: 100%;
                border-spacing: 0;
                border: 1px solid black;
                color: black;
            }
    
            td {
                text-align: center;
                border-right: 0.1px solid black;
                font-size: 16px;
            }
        </style>
    </head>
    
    <body>
    <div>
    <div style="width:90%">
  
        <div>
  
              <div style="margin-top: 10px;">
                  Liebe Auftraggeberin!
              </div>

                  <div style="margin-top: 10px;">
                      Liebe Auftraggeber!
                  </div>
  
              </div>
        <div style=" margin-top: 20px" >
        Vielen Dank für Ihre Bestellung.
       </div>
        <div style="margin-top: 10px;">
            Ihre Bestellung lautet:
        </div>
    </div>
  </div>
  
        ${orderItems.map(
          (orderItem, i) => `   
            <ul>
            <h4>
            ${orderItem.productName}
            </h4>
            <h4>
            ${userId?.firstName + " " + userId?.lastName}
        </h4>
            <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
            <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>
  
            <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
            <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
            <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
            <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
            <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt. <b style="color:red">(Zahlung vor Ort)</b> </li>
            <li> email: ${userId?.email}</li>
            <li> Telefonnummer: ${userId?.phoneNumber}</li> 
              <li> Straße & Hausnummer: ${shippingAddress?.street}</li>
                            <li> Adresszusatz: ${shippingAddress?.address}</li>
          <li> PLZ: ${shippingAddress?.postalCode}</li>
          <li> Ort: ${shippingAddress?.state}</li>
          <li> Land: ${shippingAddress?.country}</li>
            <li> Straße & Hausnummer: ${shippingAddress?.street}</li>
                        <li> Adresszusatz: ${shippingAddress?.address}</li>
            <li> Lieferung: ${shipment.du_name}</li>

            <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>
            ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
        </ul>`
        )}
         <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
    </div>
    </body>
    </html>
    
    `
      break

    case "Partner":
      Html = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>tele.inline</title>
        <style>
    .flex_dirction{
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    
            body {
                color: black;
            }
    
            table {
                width: 100%;
                border-spacing: 0;
                border: 1px solid black;
                color: black;
            }
    
            td {
                text-align: center;
                border-right: 0.1px solid black;
                font-size: 16px;
            }
        </style>
    </head>
    
    <body>
    <div>
    <div style="width:90%">
  
        <div>
  
        <div style="margin-top: 10px;">
            Liebe Auftraggeberin!
        </div>
            <div style=" margin-top: 10px;">
                Liebe Auftraggeber!
            </div>
  
        </div>
        <div style=" margin-top: 20px">
        Vielen Dank für Ihre Bestellung.
       </div>
        <div style="margin-top: 10px;">
            Ihre Bestellung lautet:
        </div>
    </div>
  </div>
  
        ${orderItems.map(
          (orderItem, i) => `   
            <ul>
            <h4>
            ${orderItem.productName}
            </h4>
            <h4>
             ${userId.firstName + " " + userId.lastName}
        </h4>
            <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
            <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>
  
            <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
            <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
            <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
            <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
            <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt. <b style="color:red">(Zahlung vor Ort)</b> </li>
            <li> email: ${userId?.email}</li>
            <li> Telefonnummer: ${userId?.phoneNumber}</li> 
            <li> Beschreibung: ${orderItem?.description}</li>
        <li> Straße & Hausnummer: ${shippingAddress?.street}</li>
                <li> Adresszusatz: ${shippingAddress?.address}</li>
          <li> PLZ: ${shippingAddress?.postalCode}</li>
          <li> Ort: ${shippingAddress?.state}</li>
          <li> Land: ${shippingAddress?.country}</li>
            <li> Lieferung: ${shipment.du_name}</li>

            <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>
            ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
        </ul>`
        )}
         <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
    </div>
    </body>
    </html>
    
    `
      break

    case "Verband,Verein":
      Html = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>tele.inline</title>
        <style>
    .flex_dirction{
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    
            body {
                color: black;
            }
    
            table {
                width: 100%;
                border-spacing: 0;
                border: 1px solid black;
                color: black;
            }
    
            td {
                text-align: center;
                border-right: 0.1px solid black;
                font-size: 16px;
            }
        </style>
    </head>
    
    <body>
    <div>
    <div style="width:90%">
  
        <div>
  
            <div style=" margin-top: 10px;">
                Liebe Auftraggeber!
            </div>
            <div style="margin-top: 10px;">
                Liebe Auftraggeberin!
            </div>
  
        </div>
        <div style=" margin-top: 20px">
        Vielen Dank für Ihre Bestellung.
       </div>
        <div style="margin-top: 10px;">
            Ihre Bestellung lautet:
        </div>
    </div>
  </div>
  
        ${orderItems.map(
          (orderItem, i) => `   
            <ul>
            <h4>
             ${userId?.chairman}
        </h4>
            <h4>
            ${orderItem.productName}
            </h4>
            <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
            <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>
  
            <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
            <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
            <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
            <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
            <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt. <b style="color:red">(Zahlung vor Ort)</b> </li>
            <li> email: ${userId?.email}</li>
            <li> Telefonnummer: ${userId?.phoneNumber}</li> 
            <li> Beschreibung: ${orderItem?.description}</li>
             <li> Straße & Hausnummer: ${shippingAddress?.street}</li>
                          <li> Adresszusatz: ${shippingAddress?.address}</li>
             <li> PLZ: ${shippingAddress?.postalCode}</li>
             <li> Ort: ${shippingAddress?.state}</li>
            <li> Land: ${shippingAddress?.country}</li>
            <li> Lieferung: ${shipment.du_name}</li>
            <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>
            ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
        </ul>`
        )}
         <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
    </div>
    </body>
    </html>
    
    `
      break

    default:
      Html = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>tele.inline</title>
        <style>
    .flex_dirction{
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    
            body {
                color: black;
            }
    
            table {
                width: 100%;
                border-spacing: 0;
                border: 1px solid black;
                color: black;
            }
    
            td {
                text-align: center;
                border-right: 0.1px solid black;
                font-size: 16px;
            }
        </style>
    </head>
    
    <body>
    <div>
    <div style="width:90%">
  
        <div>
  
        <div style="margin-top: 10px;">
            Liebe Auftraggeberin!
        </div>
            <div style=" margin-top: 10px;">
                Liebe Auftraggeber!
            </div>
  
        </div>
        <div style=" margin-top: 20px">
        Vielen Dank für Ihre Bestellung.
       </div>
        <div style="margin-top: 10px;">
            Ihre Bestellung lautet:
        </div>
    </div>
  </div>
  
        ${orderItems.map(
          (orderItem, i) => `   
            <ul>
            <h4>
            ${orderItem.productName}
            </h4>
            <h4>
            ${userId?.firstName + " " + userId?.lastName}
        </h4>
            <li> Anzahl: ${orderItem?.tableId?.count} Stück</li>
            <li> Endformat: ${orderItem?.tableId?.width}mm x ${orderItem?.tableId?.height}mm </li>
  
            <li> Druck:${orderItem?.tableId?.doubleSided ? "beidseitig" : "einseitig"} </li>
            <li> Farbigkeit:${orderItem?.tableId?.colorful ? "farbig" : "S/W"} </li>
            <li> Zellophan:${orderItem?.tableId?.isCellophane ? "ja" : "nein"} </li>
            <li> Material: ${orderItem?.tableId?.materialId?.key}</li>
            <li> Preis: € ${orderItem?.tableId?.finalPrice},-inkl. 20% MwSt. <b style="color:red">(Zahlung vor Ort)</b> </li>
            <li> email: ${userId?.email}</li>
            <li> Telefonnummer: ${userId?.phoneNumber}</li> 
           <li> Straße & Hausnummer: ${shippingAddress?.street}</li>
                      <li> Adresszusatz: ${shippingAddress?.address}</li>
          <li> PLZ: ${shippingAddress?.postalCode}</li>
          <li> Ort: ${shippingAddress?.state}</li>
          <li> Land: ${shippingAddress?.country}</li>
            <li> Straße & Hausnummer: ${shippingAddress?.street}</li>
                        <li> Adresszusatz: ${shippingAddress?.address}</li>
            <li> Lieferung: ${shipment.du_name}</li>
            ${orderItem?.tableId?.file1 ? ` <li><a href=${orderItem?.tableId?.file1}> file1: download </a></li>` : ""}
            ${orderItem?.tableId?.file2 ? ` <li><a href=${orderItem?.tableId?.file2}> file2: download </a></li>` : ""}
        </ul>`
        )}
         <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
    </div>
    </body>
    </html>
    
    `
      break
  }

  await sendMail("print@teleprint.at", `you have Order`, Html, attactment)
  await sendMail(userId.email, `Thanks for choosing us`, Html, attactment)
  return
}

async function sendSupport(Orders) {
  const attactment = [
    {
      filename: "TelePrintlogorgb.png",
      path: __dirname + "/staticGallery/TelePrintlogorgb.png",
      cid: "logo"
    }
  ]
  const Html = `
  <html lang="en">

<head>
    <meta charset="UTF-8">
    <title>tele.inline</title>
    <style>
        .flex_dirction {
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        body {
            color: black;
        }

        table {
            width: 100%;
            border-spacing: 0;
            border: 1px solid black;
            color: black;
        }

        td {
            text-align: center;
            border-right: 0.1px solid black;
            font-size: 16px;
        }
    </style>
</head>

<body>
    <div>
        <div style="width:90%">

         <div>
  
              <div style="margin-top: 10px;">
                  Liebe Auftraggeberin!
              </div>

                  <div style="margin-top: 10px;">
                      Liebe Auftraggeber!
                  </div>
  
        </div>
            <div style=" margin-top: 20px">
            Vielen Dank für Ihre Anfrage.
        </div>
            <div margin-top: 10px;">
            Ihre Anfrage lautet.
            </div>
        </div>
    </div>

    <ul>
        <h4>
            ${Orders.firstName + " " + Orders.lastName}
        </h4>
        <li> Produkte: ${Orders.product}</li>
        <li> email: ${Orders.email}</li>
        <li> Telefonnummer: ${Orders.phoneNumber}</li>
        <li> Anzahl: ${Orders.count} Stück</li>
        <li> Beschreibung: ${Orders.description}</li>

        ${
          Orders.file1
            ? `<li><a href=${Orders.file1} download> file1: download </a></li>
        `
            : ""
        }
        ${
          Orders.file2
            ? `<li><a href=${Orders.file2} download> file2: download </a></li>
        `
            : ""
        }
    </ul>

   <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
    </div>
</body>

</html>
    `

  await sendMail("print@teleprint.at", `you have Order`, Html, attactment)

  await sendMail(Orders.email, `Thanks for choosing us`, Html, attactment)
}

async function sendComplaint(Orders) {
  const attactment = [
    {
      filename: "TelePrintlogorgb.png",
      path: __dirname + "/staticGallery/TelePrintlogorgb.png",
      cid: "logo"
    }
  ]
  const Html = `
    <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <title>tele.inline</title>
      <style>
          .flex_dirction {
              width: 100%;
              display: flex;
              flex-direction: column;
          }
  
          body {
              color: black;
          }
  
          table {
              width: 100%;
              border-spacing: 0;
              border: 1px solid black;
              color: black;
          }
  
          td {
              text-align: center;
              border-right: 0.1px solid black;
              font-size: 16px;
          }
      </style>
  </head>
  
  <body>
      <div>
          <div style="width:90%">
  
              <div>
  
              <div style="margin-top: 10px;">
                  Liebe Auftraggeberin!
              </div>

                  <div style="margin-top: 10px;">
                      Liebe Auftraggeber!
                  </div>
  
              </div>
              <div style=" margin-top: 20px">
          vielen Dank für Ihre Nachricht. 
          </div>
              <div style=" margin-top: 10px;">
              
Zunächst möchten wir uns bei Ihnen entschuldigen, dass die gelieferte Ware nicht die erwartete. <div> Qualität aufweist
              Wir ersuchen um etwas Zeit, damit wir Ihr E-Mail bearbeiten können.
              </div>
</div>
          </div>
      </div>
  
      <ul>
          <h4>
              ${Orders.firstName + " " + Orders.lastName}
          </h4>
          <li> Produkte: ${Orders.product}</li>
          <li> email: ${Orders.email}</li>
          <li> Telefonnummer: ${Orders.phoneNumber}</li>
          <li> Beschreibung: ${Orders.description}</li>
  
          ${
            Orders.file1
              ? `<li><a href=${Orders.file1} download> file1: download </a></li>
          `
              : ""
          }
          ${
            Orders.file2
              ? `<li><a href=${Orders.file2} download> file2: download </a></li>
          `
              : ""
          }
      </ul>
  
      <div style="width:100%; display: flex; justify-content: center; padding-bottom: 20px;">
          <div style="width:95%;">
             
              <div
                  style="min-height:40px;width:85%; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Unsere Öffnungszeiten sind Mo. bis Fr. von 9 bis 18 Uhr.
              </div>
              <div style="min-height:20px; font-size: 14px; font-weight: 700; line-height: 18px; margin-top: 10px;">
                  Mit freundlichen Grüßen
                  <div>
                  Ihr TELEprint - Team
                  </div>
              </div>
              <div style=" margin-top: 20px">
                  TELEprint Digitaldruck KG</div>
              <div> 1070 Wien, Westbahnstraße 9, Tel. 01 524 32 56 </div>
              <div> FN 479000 m, HG Wien</div>
              <div> UID-Nummer: ATU 7292 0226</div>
          </div>
      </div>
      </div>
  </body>
  
  </html>
      `

  await sendMail("print@teleprint.at", `you have Order`, Html, attactment)

  await sendMail(Orders.email, `Thanks for choosing us`, Html, attactment)
}
module.exports = { sendMail, sendBill, sendSupport, sendSimpleEmail, sendBillNew, spotPaymentSend, sendComplaint, SendProductList, ChangeStatus }
{
  /* <li> Seitenzahl: 2</li> */
}

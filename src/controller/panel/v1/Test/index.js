/** @format */

const BaseController = require("../../../BaseController")
const NodeMailer = require("../../../../util/nodeMailer")
const InvoiceService = require("../../../../service/v1/Invoice")
const moment = require("moment-jalaali")
const fs = require("fs")
const pdf = require("html-pdf")
const path = require("path")

const { GeneralPanel } = require("../../../../log")
module.exports = new (class RollUp_EndFormatController extends BaseController {
  async testEmail(req, res) {
    try {
      const url = path.join(__dirname, "index.html")
      let html = fs.readFileSync(url, "utf8")
      const options = {
        format: "A4",
        footer: {
          height: "160px"
        },
        header: {
          height: "180px"
        }
      }

      const CreatedInvoice = await InvoiceService.model
        .findOne({ _id: "62fe45f97f0cf6475fc47014" })
        .populate({
          path: "orderIds",
          populate: { path: "tableId", populate: { path: "materialId" } }
        })
        .lean()

      const createdInvoice = await InvoiceService.CreateInovice(CreatedInvoice.orderIds, 0)
      // const body = CreatedInvoice.orderIds.map((order) => {
      //   return `
      //     <tr>
      //     <td class="Beschreibung">
      //         <span>${order.productName}</span>

      //     </td>
      //     <td class="Menge">${
      //       order.tableId && order.tableId.count ? order.tableId.count : 1
      //     }</td>
      //     <td class="Preis">${order.tableId.finalPrice * 0.8} €</td>
      //     <td class="Netto">${order.tableId.finalPrice} €</td>
      // </tr>

      //    `;
      // });
      // html = html.replace("{{trbody}}", body);
      // html = html.replace("{{Rechnungsnummer}}", CreatedInvoice.invoiceNumber);
      // html = html.replace(
      //   "{{Datum}}",
      //   moment(CreatedInvoice.createdAt).format("DD-MM-YYYY")
      // );
      // html = html.replace(
      //   "{{Name}}",
      //   CreatedInvoice.firstName + " " + CreatedInvoice.lastName
      // );
      // html = html.replace("{{Address}}", CreatedInvoice.address);
      // html = html.replace("{{SummeNetto}}", CreatedInvoice.totalPayment * 0.8);
      // html = html.replace("{{SummeNetto1}}", CreatedInvoice.totalPayment * 0.8);
      // html = html.replace("{{Tax}}", CreatedInvoice.totalPayment * 0.2);
      // html = html.replace("{{Total}}", CreatedInvoice.totalPayment);

      // pdf
      //   .create(html, options)
      //   .toFile(`./test${Date.now()}.pdf`, function (err, respanse) {
      //     if (err) {
      //       console.log(err);
      //       return res.status(400).json({
      //         data: "",
      //         message: "pdf bug",
      //       });
      //     }
      //     console.log(respanse);

      //     return res.status(200).json({ data: respanse }); // { filename: '/app/businesscard.pdf' }
      //   });
      return res.status(204)
    } catch (error) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

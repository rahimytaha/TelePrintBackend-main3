/** @format */

const BaseService = require("../baseService")
const ModelLabel = require("../../model/v1/OrderStatus")

module.exports = new (class Service extends BaseService {
  async Initialize() {
    try {
      const OrderStatusArray = [
        {
          en_name: "Reserved",
          du_name: "Reserviert",
          key: "Reserved",
          description: "",
          sort: 1,
          sendEmail: false,
          emailContent:
            "Ihre Bestellung ist reserviert. Wir bereiten sie derzeit für die nächsten Schritte vor. Sie erhalten eine Nachricht, sobald wir fortfahren. Vielen Dank für Ihre Geduld."
        },
        {
          en_name: "Submitted",
          du_name: "Submitted",
          key: "Submitted",
          description: "",
          sort: 2,
          sendEmail: false,
          emailContent: `Wir haben Ihre Bestellung erfolgreich erhalten. Sie wurde eingereicht und wird in Kürze verarbeitet. Vielen Dank für Ihren Einkauf.`
        },
        {
          en_name: "Processing",
          du_name: "Verarbeitung",
          key: "Processing",
          description: "",
          sort: 3,
          sendEmail: true,
          emailContent: `Ihre Bestellung wird jetzt bearbeitet. Wir bereiten sie für den Versand vor, und Sie erhalten eine Nachricht, sobald sie unterwegs ist. Vielen Dank für Ihre Geduld.`
        },
        {
          en_name: "Product Ready",
          du_name: "Produziert",
          key: "Product_Ready",
          description: "",
          sort: 4,
          sendEmail: true,
          emailContent: `Ihr Produkt ist jetzt fertig und kann abgeholt werden. Vielen Dank, dass Sie sich für uns entschieden haben.`
        },

        {
          en_name: "Shipped",
          du_name: "Versendet",
          key: "Shipped",
          description: "",
          sendEmail: true,
          sort: 5,
          emailContent: `Ihre Bestellung wurde versendet und ist auf dem Weg zu Ihnen. Vielen Dank für Ihren Einkauf.`
        },

        {
          en_name: "Delivered",
          du_name: "Geliefert",
          key: "Delivered",
          description: "",
          sort: 6,
          sendEmail: true,
          emailContent: `Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Bestellung erfolgreich geliefert wurde. Vielen Dank für Ihren Einkauf. Wir hoffen, Sie bald wieder bedienen zu dürfen.`
        },
        {
          en_name: "Completed",
          du_name: "Abgeschlossen",
          key: "Completed",
          description: "",
          sort: 7,
          sendEmail: false,
          emailContent: `Ihre Bestellung ist abgeschlossen. Wenn Sie Fragen haben oder weitere Hilfe benötigen, wenden Sie sich bitte an unser Support-Team. Vielen Dank, dass Sie sich für uns entschieden haben.`
        },
        {
          en_name: "Cancelled",
          du_name: "Storniert",
          key: "Cancelled",
          description: "",
          sort: 8,
          sendEmail: true,
          emailContent: `Ihre Bestellung wurde gemäß Ihrer Anfrage storniert. Wenn dies nicht beabsichtigt war oder Sie weitere Hilfe benötigen, wenden Sie sich bitte an unser Support-Team. Wir entschuldigen uns für die Unannehmlichkeiten.`
        },
        {
          en_name: "Server Error",
          du_name: "Serverfout",
          key: "Server_Error",
          description: "",
          sort: 9,
          sendEmail: false,
          emailContent: `Wir haben einen Fehler bei der Bearbeitung Ihrer Bestellung festgestellt. Wir bitten um Ihre Geduld, während wir dieses Problem lösen. Wenn Sie weitere Hilfe benötigen, wenden Sie sich bitte an uns. Wir entschuldigen uns für die Unannehmlichkeiten.`
        }
      ]

      await Promise.all(
        OrderStatusArray.map(async (status) => {
          const thisstatus = await this.findOneByCondition({
            key: status.key,
            isDeleted: { $ne: true }
          })
          if (!thisstatus) {
            const prepareObject = {
              en_name: status.en_name,
              du_name: status.du_name,
              description: status.description,
              sort: status.sort,
              sendEmail: status.sendEmail,
              key: status.key,
              emailContent: status.emailContent
            }
            await this.createObject(prepareObject)
            return
          }

          const prepareObject = {
            en_name: status.en_name,
            du_name: status.du_name,
            description: status.description,
            sort: status.sort,
            sendEmail: status.sendEmail,
            emailContent: status.emailContent
          }
          await this.update({ _id: thisstatus._id }, prepareObject)
        })
      )
      return { hasError: false }
    } catch (error) {
      console.log(error)
      return { hasError: true, error: error }
    }
  }
})(ModelLabel)

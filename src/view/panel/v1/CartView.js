/** @format */

const { BASE_URL_FOR_MULTER } = require("../../../config")
const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    function iconHandler(orderItems) {
      if (!orderItems || !orderItems.length) {
        return []
      }
      const newArray = orderItems.map((item) => {
        let icon = ""
        switch (item.tableName) {
          case "FlyerRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/flyer.svg`
            break
          case "Button_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/buttons.svg`
            break
          case "Package":
            icon = `${BASE_URL_FOR_MULTER}/static/Package.svg`
            break
          case "FolderEin_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/folder.svg`
            break

          case "BroschuerenRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/broschueren.svg`
            break
          case "BuchdruckRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/buchdruck.svg`
            break
          case "DiplomarbeitRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/diplomarbeit.svg`
            break
          case "DurchschreibebloeckeRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/durchschreibebloecke.svg`
            break
          case "EintrittskartenRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/eintrittskarten.svg`
            break
          case "FolderWickelfalz6seiten_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/folder-wf-6p.svg`
            break
          case "FolderWickelfalz8seiten_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/folder-wf-8p.svg`
            break
          case "FolderZfalz6Seiten_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/folder-zf-6p.svg`
            break
          case "FolderZfalz8Seiten_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/folder-zf-8p.svg`
            break
          case "FotokalenderRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/fotokalender.svg`
            break
          case "FotoposterRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/fotoposter.svg`
            break
          case "KeilrahmenRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/keilrahmen.svg`
            break
          case "KlebebuchstabenRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/klebebuchstaben.svg`
            break
          case "KlebefolienRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/klebefolien.svg`
            break
          case "KalenderRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/kalender.svg`
            break
          case "LaminiertePlakateRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/laminierte-plakate.svg`
            break
          case "Lesezeichen_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/lesezeichen.svg`
            break
          case "LoseBlattsammlungRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/lose-blattsammlung.svg`
            break
          case "PlanDruckRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/plandruck.svg`
            break
          case "PlakateRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/plakate.svg`
            break
          case "PresspappeRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/presspappe.svg`
            break
          case "RuckenbandbindungRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/ruckenbandbindung.svg`
            break
          case "RollUp_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/rollups.svg`
            break
          case "SchaumplattenRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/schaumplatten.svg`
            break
          case "SoftcoverBuecherRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/softcover-buecher.svg`
            break
          case "SpiralBloeckeRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/spiralbloecke.svg`
            break
          case "PrintyDatumstempel_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/stempel.svg`
            break
          case "StickerRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/sticker.svg`
            break
          case "StofftaschenRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/stofftaschen.svg`
            break
          case "TischkartenRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/tischkarten.svg`
            break
          case "TshirtsRecord":
            icon = `${BASE_URL_FOR_MULTER}/static/tshirts.svg`
            break
          case "Visitenkarte_Standard_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/visitenkarten.svg`
            break
          case "Visitenkarte_Klapp_Record":
            icon = `${BASE_URL_FOR_MULTER}/static/visitenkarten.svg`
            break
          default:
            break
        }
        return { ...item._doc, icon }
      })
      return newArray
    }
    return {
      id: item._id,
      statusId: item.statusId,

      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      orderItems: iconHandler(item.orderItems),
      userId: item.userId,
      description: item.description,
      paymentType: item.paymentType,
      statusName: item.statusName,
      statusCode: item.statusCode,
      shipment: item.shipment,
      invoiceId: item.invoiceId,
      shippingAddress: item.shippingAddress,
      billingAddress: item.billingAddress,
      finalPrice: item.finalPrice,
      priceWithOutTax: item.priceWithOutTax,
      Tax: item.Tax,
      shippingPrice: item.shippingPrice
    }
  }
})()

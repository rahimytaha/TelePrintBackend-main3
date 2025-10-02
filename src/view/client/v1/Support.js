/** @format */

const { BASE_URL_FOR_MULTER } = require("../../../config")
const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    function iconHandler(product) {
      let icon = ""
      switch (product) {
        case "Flyer":
          icon = `${BASE_URL_FOR_MULTER}/static/flyer.svg`
          break
        case "Package":
          icon = `${BASE_URL_FOR_MULTER}/static/Package.svg`
          break
        case "Buttons":
          icon = `${BASE_URL_FOR_MULTER}/static/buttons.svg`
          break
        case "Folder":
          icon = `${BASE_URL_FOR_MULTER}/static/folder.svg`
          break

        case "Broschüren":
          icon = `${BASE_URL_FOR_MULTER}/static/broschueren.svg`
          break
        case "Buchdruck":
          icon = `${BASE_URL_FOR_MULTER}/static/buchdruck.svg`
          break
        case "Diplomarbeit":
          icon = `${BASE_URL_FOR_MULTER}/static/diplomarbeit.svg`
          break
        case "Durchschreibeblöcke":
          icon = `${BASE_URL_FOR_MULTER}/static/durchschreibebloecke.svg`
          break
        case "Etiketten":
          icon = `${BASE_URL_FOR_MULTER}/static/eintrittskarten.svg`
          break
        case "Plakate":
          icon = `${BASE_URL_FOR_MULTER}/static/fotoposter.svg`
          break
        case "Keilrahmen":
          icon = `${BASE_URL_FOR_MULTER}/static/keilrahmen.svg`
          break
        case "Klebebuchstaben":
          icon = `${BASE_URL_FOR_MULTER}/static/klebebuchstaben.svg`
          break
        case "Klebefolien":
          icon = `${BASE_URL_FOR_MULTER}/static/klebefolien.svg`
          break
        case "Kalender":
          icon = `${BASE_URL_FOR_MULTER}/static/kalender.svg`
          break
        case "Laminierte_Plakate":
          icon = `${BASE_URL_FOR_MULTER}/static/laminierte-plakate.svg`
          break
        case "Lesezeichen":
          icon = `${BASE_URL_FOR_MULTER}/static/lesezeichen.svg`
          break
        case "Lose_Blattsammlung":
          icon = `${BASE_URL_FOR_MULTER}/static/lose-blattsammlung.svg`
          break
        case "Plandruck":
          icon = `${BASE_URL_FOR_MULTER}/static/plandruck.svg`
          break

        case "Presspappe":
          icon = `${BASE_URL_FOR_MULTER}/static/presspappe.svg`
          break
        case "Rückenbandbindung":
          icon = `${BASE_URL_FOR_MULTER}/static/ruckenbandbindung.svg`
          break
        case "Roll_Ups":
          icon = `${BASE_URL_FOR_MULTER}/static/rollups.svg`
          break
        case "Schaumplatten":
          icon = `${BASE_URL_FOR_MULTER}/static/schaumplatten.svg`
          break
        case "Softcover_Bücher":
          icon = `${BASE_URL_FOR_MULTER}/static/softcover-buecher.svg`
          break
        case "Spiralbuch":
          icon = `${BASE_URL_FOR_MULTER}/static/spiralbloecke.svg`
          break
        case "Stempel":
          icon = `${BASE_URL_FOR_MULTER}/static/stempel.svg`
          break
        case "Sticker":
          icon = `${BASE_URL_FOR_MULTER}/static/sticker.svg`
          break
        case "Stofftaschen":
          icon = `${BASE_URL_FOR_MULTER}/static/stofftaschen.svg`
          break
        case "Tischkarten":
          icon = `${BASE_URL_FOR_MULTER}/static/tischkarten.svg`
          break
        case "T-Shirts":
          icon = `${BASE_URL_FOR_MULTER}/static/tshirts.svg`
          break
        case "Visitenkarten":
          icon = `${BASE_URL_FOR_MULTER}/static/visitenkarten.svg`
          break

        default:
          icon = `${BASE_URL_FOR_MULTER}/static/Package.svg`
          break
      }
      return icon
    }
    return {
      id: item._id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      icon: iconHandler(item.product),
      phoneNumber: item.phoneNumber,
      file1: item.file1,
      file2: item.file2,
      product: item.product,
      description: item.description,
      count: item.count
    }
  }
})()

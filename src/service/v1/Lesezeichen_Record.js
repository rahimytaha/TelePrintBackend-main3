/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/Lesezeichen_Record")

module.exports = new (class serviceModel extends BaseService {
  async calculatorPrice(req, Material) {
    const { count, width, height, doubleSided, colorful, isCellophane } = req.body
    const SA = this.SA(count, width, height)
    const cellephonePrice = this.cellephoned(SA)
    const foldPrice = this.foldPrice(count)
    let result = 0
    if (String(colorful) === String(true) && String(doubleSided) === String(true)) {
      result = await this.ColorTwoSide(SA, Material.price)
    }
    if (String(colorful) === String(true) && String(doubleSided) === String(false)) {
      result = await this.ColorOneSide(SA, Material.price)
    }
    if (String(colorful) === String(false) && String(doubleSided) === String(true)) {
      result = await this.notColorTwoSide(SA, Material.slopeTwoSided, Material.price)
    }
    if (String(colorful) === String(false) && String(doubleSided) === String(false)) {
      result = await this.notColorOneSide(SA, Material.slopeOneSided, Material.price)
    }
    const FinalResult = String(isCellophane) === "true" ? result + cellephonePrice : result
    const lastPrice = (FinalResult + foldPrice) * 1.15

    return Math.ceil(lastPrice)
  }

  async notColorOneSide(SA, lineSlope, paperPrice) {
    const result = Math.ceil(SA * (lineSlope + paperPrice) + 12)
    return result * 1.3
  }

  async notColorTwoSide(SA, lineSlope, paperPrice) {
    const result = Math.ceil(SA * (lineSlope + paperPrice) + 14)

    return result * 1.3
  }

  async ColorOneSide(SA, paperPrice) {
    const J66 = SA > 7090 ? 0.0155 : 12076 / (SA * 110)
    const logFunction = Math.log(SA * J66) / Math.log(SA + 1)
    const K66 = logFunction > 0.797423085 ? 0.797423085 : logFunction
    const k33 = paperPrice + 0.14034
    const L33 = k33 * (SA + 12)

    let J33 = 0

    if (300 < SA < 1100) {
      J33 = (SA - 299) * (0.0682 + paperPrice) + 112
    }
    if (300 >= SA || SA >= 1100) {
      J33 = (SA + 12) * paperPrice + Number(Math.pow(SA + 12, K66) + 5.5)
    }
    const Result = J33 >= L33 ? Math.ceil(J33) : Math.ceil(L33)
    return Result * 1.2
  }
  async ColorTwoSide(SA, paperPrice) {
    const J74 = SA > 5492.95 ? 0.0255 : 9976 / (SA * 71)
    const logFunction = Math.log(SA * J74) / Math.log(SA + 1)
    const K74 = logFunction > 0.889419174 ? 0.889419174 : logFunction
    const M33 = (SA + 12) * paperPrice + Math.pow(SA + 12, K74) + 7
    const O33 = (0.201664706 + paperPrice) * (SA + 12)

    const Result = M33 >= O33 ? Math.ceil(M33) : Math.ceil(O33)
    return Result * 1.2
  }

  SA(count, width, height) {
    const SAResult = (count * width * height) / 124740
    return SAResult
  }
  cellephoned(SA) {
    return SA * 0.6 + 12
  }
  foldPrice(count) {
    return 0
  }
})(Model)

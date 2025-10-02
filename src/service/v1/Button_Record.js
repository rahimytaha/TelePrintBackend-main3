/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/Button_Record")

module.exports = new (class serviceModel extends BaseService {
  async calculatorPrice(req) {
    let { count, width } = req.body
    count = Number(count)
    width = Number(width)
    const SA = this.SA(count, 74, 105)
    let result = 0

    result = await this.ColorOneSide(SA, 0.0284)
    const ButtomResult = this.buttonsPrice(width, count)
    const finalPrice = ButtomResult + result + (ButtomResult + result) * 0.15
    return Math.ceil(finalPrice)
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
    return Result
  }

  SA(count, width, height) {
    const SAResult = (count * width * height) / 124740
    return SAResult
  }
  buttonsPrice(width, count) {
    let Price_width = 0
    switch (width) {
      case 24:
        Price_width = 0.35
        break
      case 37:
        Price_width = 0.4
        break
      case 56:
        Price_width = 0.7
        break
      case 75:
        Price_width = 0.9
        break
      default:
        Price_width = 0.9
        break
    }
    return Price_width * count
  }
})(Model)

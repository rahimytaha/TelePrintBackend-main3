/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/RollUp_Record")

module.exports = new (class serviceModel extends BaseService {
  async calculatorPrice(req, Material) {
    const width = Number(req.body.width)
    const count = Number(req.body.count)

    if (width === 1000) {
      return Math.ceil(count * 84 * 1.35)
    } else if (width === 850) {
      return Math.ceil(count * 69 * 1.35)
    }
  }
})(Model)

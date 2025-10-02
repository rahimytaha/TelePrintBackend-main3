/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/PrintyDatumstempel_Record");

module.exports = new (class serviceModel extends BaseService {
  async calculatorPrice(req, art) {
    const { count, isComplete } = req.body;
    const Price = isComplete ? art.completePrice : art.platePrice;
    const Result = count * Price * 1.15;

    return Math.ceil(Result);
  }
})(Model);

/** @format */

const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      slopeOneSided: item.slopeOneSided,
      slopeTwoSided: item.slopeTwoSided,
      price: item.price,
      key: item.key,
      isCellophane: item.isCellophane,
      max: item.max,
      price: item.price
    }
  }
})()

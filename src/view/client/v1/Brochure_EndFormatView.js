/** @format */

const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      cost: item.cost,
      key: item.key,
      width: item.width,
      height: item.height
    }
  }
})()

/** @format */

const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      count: item.count,
      width: item.width,
      height: item.height,
      materialId: item.materialId,
      finalPrice: item.finalPrice,
      phoneNumber: item.phoneNumber,
      file1: item.file1,
      file2: item.file2,
      description: item.description
    }
  }
})()

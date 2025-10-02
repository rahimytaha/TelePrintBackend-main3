/** @format */

const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      file1: item.file1,
      file2: item.file2,
      product: item.product,
      description: item.description,
      count: item.count
    }
  }
})()

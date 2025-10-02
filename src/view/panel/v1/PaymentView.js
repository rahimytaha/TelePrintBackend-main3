/** @format */

const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    console.log(item)
    return {
      id: item._id,
      amount: item.amount,
      client_secret: item.client_secret,
      sessionId: item.sessionId,
      phoneNumber: item.phoneNumber,
      statusCode: item.statusCode,
    }
  }
})()

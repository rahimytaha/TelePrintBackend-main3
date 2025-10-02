/** @format */

const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      en_name: item.en_name,
      du_name: item.du_name,
      description: item.description,
      sort: item.sort,
      key: item.key,
      sendEmail: item.sendEmail
    }
  }
})()

/** @format */

const BaseView = require("../../BaseView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      key: item.key,
      CMYK: item.CMYK,
      RGB: item.RGB,
    };
  }
})();

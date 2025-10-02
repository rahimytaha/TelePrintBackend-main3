/** @format */

const BaseView = require("../../BaseView");
const ImageView = require("./ImageView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      key: item.key,
      price: item.price,
      images:
        item.Images && item.Images.length
          ? ImageView.transformCollection(item.Images)
          : [],
    };
  }
})();

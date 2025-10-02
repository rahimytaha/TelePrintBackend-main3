/** @format */

const BaseView = require("../../BaseView");
const ImageView = require("./ImageView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      cost: item.cost,
      key: item.key,
      width: item.width,
      height: item.height,
      images: item.Images && item.Images.length ? ImageView.transformCollection(item.Images) : []
    };
  }
})();

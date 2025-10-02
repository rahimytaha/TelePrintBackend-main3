/** @format */

const BaseView = require("../../BaseView");
const ImageView = require("./ImageView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      slopeOneSided: item.slopeOneSided,
      slopeTwoSided: item.slopeTwoSided,
      price: item.price,
      key: item.key,
      isCellophane: item.isCellophane,
      cellophaneType: item.cellophaneType,
      price: item.price,
      images: item.Images && item.Images.length ? ImageView.transformCollection(item.Images) : [],
    };
  }
})();

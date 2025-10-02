/** @format */

const BaseView = require("../../BaseView");
const ImageView = require("./ImageView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,

      categoryId: item.categoryId && item.categoryId._id ? item.categoryId._id : item.categoryId,
      key: item.key,
      description: item.description,
      images: item.Images && item.Images.length ? ImageView.transformCollection(item.Images) : []
    };
  }
})();

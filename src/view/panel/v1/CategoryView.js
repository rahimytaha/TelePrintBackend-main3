/** @format */

const BaseView = require("../../BaseView");
const ImageView = require("./ImageView");
module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      key: item.key,
      parentId: item.parentId,
      sort: item.sort,
      images: item.Images && item.Images.length ? ImageView.transformCollection(item.Images) : [],
      child: item.child ? this.transformCollection(item.child) : []
    };
  }
})();

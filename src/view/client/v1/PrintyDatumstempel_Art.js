/** @format */

const BaseView = require("../../BaseView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      key: item.key,
      productKey: item.productKey,
      isRound: item.isRound,
      completePrice: item.completePrice,
      platePrice: item.platePrice,
      price: item.price,
    };
  }
})();

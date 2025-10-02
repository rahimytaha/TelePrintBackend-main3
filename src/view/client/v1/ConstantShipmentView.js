/** @format */

const BaseView = require("../../BaseView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      name: item.name,
      cost: item.cost,
      du_name: item.du_name,
      freeAfterAmount: item.freeAfterAmount,
    };
  }
})();

/** @format */

const BaseView = require("../../BaseView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      name: item.name,
      postalCode: item.postalCode,
      country: item.country,
      address: item.address,
      street: item.street,
      state: item.state,
    };
  }
})();

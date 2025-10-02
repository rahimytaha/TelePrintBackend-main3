const BaseView = require("../../BaseView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      url: item.url,
    };
  }
})();

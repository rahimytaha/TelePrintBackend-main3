/** @format */

const BaseView = require("../../BaseView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      tableName: item.tableName,
      tableId: item.tableId,
      productName: item.productName,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }
})();

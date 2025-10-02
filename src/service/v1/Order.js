/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Order");

module.exports = new (class serviceModel extends BaseService {
  async calculateOrderAmount(req) {
    try {
      const Orders = await this.findAllAndPopulate(
        {
          email: req.body.email,
          statusName: { $in: ["not_submitted", "payment_processing"] },
        },
        {
          path: "tableId",
          populate: {
            path: "materialId",
          },
        },
      );

      if (!Orders || !Orders.length) {
        return 0;
      }
      let amount = 0;
      await Orders.map((order) => (amount += order.tableId.finalPrice));
      return amount;
    } catch (error) {
      console.error(error);
    }
  }

  async handleChangeStatus(req) {
    try {
      await this.updateAll(
        {
          email: req.body.email,
          statusName: "not_submitted",
        },
        {
          statusName: "payment_processing",
        },
      );
    } catch (error) {
      console.error(error);
    }
  }
})(Model);

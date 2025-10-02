/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/User");
const OrderService = require("../../service/v1/Order");

module.exports = new (class serviceModel extends BaseService {
  async syncEmailWithUserId(email, userId) {
    try {
      await OrderService.updateAll({ email: email }, { userId: userId });
    } catch (error) {
      console.error(`UserService syncEmailWithUserId date: ${new Date()}`, error);
      return { hasError: true, error: error };
    }
  }
})(Model);

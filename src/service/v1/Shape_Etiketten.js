/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Shape_Etiketten");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { cost: 0, key: "Rund-Oval" },
        { cost: 0, key: "Quadratisch-Rechtekig" }
      ];
      await Promise.all(
        DATA.map(async (obj) => {
          const thisStatus = await this.findOneByCondition(obj);
          if (!thisStatus) {
            const createInventoryStatus = await this.createObject(obj);
          }
        })
      );
    } catch (error) {
      return error;
    }
  }
})(Model);

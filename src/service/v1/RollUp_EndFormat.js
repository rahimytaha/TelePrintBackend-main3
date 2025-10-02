/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/RollUp_EndFormat");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "100x200 cm", width: 1000, height: 2000, sort: 0 },
        { key: "85x200 cm", width: 850, height: 2000, sort: 1 },
      ];
      await Promise.all(
        DATA.map(async (obj) => {
          const thisStatus = await this.findOneByCondition(obj);
          if (!thisStatus) {
            const createInventoryStatus = await this.createObject(obj);
          }
        }),
      );
    } catch (error) {
      return error;
    }
  }
})(Model);

/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Material_Klebe_Buchstabe");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { cost: 0, key: "Glänzend" },
        { cost: 0, key: "Matt" },
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

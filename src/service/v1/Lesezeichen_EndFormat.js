/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Lesezeichen_EndFormat");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "55x173 mm", width: 55, height: 173, sort: 0 },
        { key: "50x215 mm", width: 50, height: 215, sort: 1 },
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

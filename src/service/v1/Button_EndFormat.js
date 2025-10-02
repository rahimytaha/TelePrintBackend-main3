/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Button_EndFormat");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "Ø 24 mm Durchmesser", width: 24, height: 24, sort: 0 },
        { key: "Ø 37 mm Durchmesser", width: 37, height: 37, sort: 1 },
        { key: "Ø 56 mm Durchmesser", width: 56, height: 56, sort: 2 },
        { key: "Ø 75 mm Durchmesser", width: 75, height: 75, sort: 3 },
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

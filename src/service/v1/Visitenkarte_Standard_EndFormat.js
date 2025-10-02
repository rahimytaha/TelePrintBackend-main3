/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Visitenkarte_Standard_EndFormat");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "Standard quer 85 x 55 mm", width: 85, height: 55, sort: 0 },
        { key: "Standard hoch 55 x 85 mm", width: 55, height: 85, sort: 1 },
        { key: "Sonderformat quer 90 x 50 mm", width: 90, height: 50, sort: 2 },
        { key: "Sonderformat hoch 50 x 90 mm", width: 50, height: 90, sort: 3 },
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

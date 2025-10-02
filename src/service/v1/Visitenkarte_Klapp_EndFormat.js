/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Visitenkarte_Klapp_EndFormat");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "Klapp quer 85 x 55 mm (offen: 170 x 55 mm)", width: 170, height: 55, sort: 0 },
        { key: "Klapp hoch 55 x 85 mm (offen: 110 x 85 mm)", width: 110, height: 85, sort: 1 },
        { key: "Klapp quer 90 x 50 mm (offen: 180 x 50 mm)", width: 180, height: 50, sort: 2 },
        { key: "Klapp hoch 50 x 90 mm (offen: 100 x 90 mm)", width: 100, height: 90, sort: 3 },
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

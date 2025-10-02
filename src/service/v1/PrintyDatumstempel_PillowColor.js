/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/PrintyDatumstempel_PillowColor");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "Schwarz", CMYK: "85-74-62-86", Hex: "#05090E" },
        { key: "Blau", CMYK: "100-69-6-30", Hex: "#0037A8" },
        { key: "Rot", CMYK: "5-100-92-22", Hex: "#BD0010" },
        { key: "Ohne kissen", CMYK: "", Hex: "" },
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

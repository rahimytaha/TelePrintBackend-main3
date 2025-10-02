/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/EndFormat_Etiketten");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "A0", width: 841, height: 1189 },
        { key: "A1", width: 596, height: 841 },
        { key: "A2", width: 420, height: 596 },
        { key: "A3", width: 297, height: 420 },
        { key: "A4", width: 210, height: 297 },
        { key: "A5", width: 148, height: 210 },
        { key: "A6", width: 105, height: 148 },
        { key: "A7", width: 74, height: 105 },
        { key: "A8", width: 52, height: 74 },
        { key: "A9", width: 37, height: 52 },
        { key: "A10", width: 26, height: 37 },
        { key: "A11", width: 18, height: 26 },
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

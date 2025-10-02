/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/CustomForm_Etiketten");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { cost: 0, key: "Etiketten auf Bogen-Stickerbögen" },
        { cost: 0, key: "Etiketten-Sticker einzeln ausgestanzt" }
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

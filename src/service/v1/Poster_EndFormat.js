/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Poster_EndFormat");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "A0 hoch (1189 x 841 mm)", width: 1189, height: 841, sort: 0 },
        { key: "A0 quer (841 x 1189 mm)", width: 841, height: 1189, sort: 1 },
        { key: "A1 hoch (841 x 594 mm)", width: 841, height: 594, sort: 2 },
        { key: "A1 quer (594 x 841 mm)", width: 594, height: 841, sort: 3 },
        { key: "A2 hoch (594 x 420 mm)", width: 594, height: 420, sort: 4 },
        { key: "A2 quer (420 x 594 mm)", width: 420, height: 594, sort: 5 },
        { key: "A3 hoch (420 x 297 mm)", width: 420, height: 297, sort: 6 },
        { key: "A3 quer (297 x 420 mm)", width: 297, height: 420, sort: 7 },
        { key: "A4 hoch (297 x 210 mm)", width: 297, height: 210, sort: 8 },
        { key: "A4 quer (210 x 297 mm)", width: 210, height: 297, sort: 9 },
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

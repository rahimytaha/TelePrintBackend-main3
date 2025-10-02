/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Flyer_EndFormat");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "A3 hoch (297 x 420 mm)", width: 297, height: 420, sort: 0 },
        { key: "A3 quer (420 x 297 mm)", width: 420, height: 297, sort: 1 },
        { key: "A4 hoch (210 x 297 mm)", width: 210, height: 297, sort: 2 },
        { key: "A4 quer (297 x 210 mm)", width: 297, height: 210, sort: 3 },
        { key: "A5 hoch (148 x 210 mm)", width: 148, height: 210, sort: 4 },
        { key: "A5 quer (210 x 148 mm)", width: 210, height: 148, sort: 5 },
        { key: "A6 hoch (105 x 148 mm)", width: 105, height: 148, sort: 6 },
        { key: "A6 quer (148 x 105 mm)", width: 148, height: 105, sort: 7 },
        { key: "A7 hoch (74 x 105 mm)", width: 74, height: 105, sort: 8 },
        { key: "A7 quer (105 x 74 mm)", width: 105, height: 74, sort: 9 },
        { key: "lang S hoch (99 x 210 mm)", width: 99, height: 210, sort: 10 },
        { key: "lang S quer (210 x 99 mm)", width: 210, height: 99, sort: 11 },
        { key: "lang M hoch (105 x 210 mm)", width: 105, height: 210, sort: 12 },
        { key: "lang M quer (210 x 105 mm)", width: 210, height: 105, sort: 13 },
        { key: "lang L hoch (105 x 297 mm)", width: 105, height: 297, sort: 14 },
        { key: "lang L quer (297 x 105 mm)", width: 297, height: 105, sort: 15 },
        { key: "Quadrat (99 x 99 mm)", width: 99, height: 99, sort: 16 },
        { key: "Quadrat (120 x 120 mm)", width: 120, height: 120, sort: 17 },
        { key: "Quadrat (130 x 130 mm)", width: 130, height: 130, sort: 18 },
        { key: "Quadrat (140 x 140 mm)", width: 140, height: 140, sort: 19 },
        { key: "Quadrat (210 x 210 mm)", width: 210, height: 210, sort: 20 },
        { key: "Quadrat (210 x 300 mm)", width: 210, height: 210, sort: 21 },
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

/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/Brochure_EndFormat")

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "A4 hoch", width: 420, height: 297, sort: 0 },
        { key: "A5 quer", width: 420, height: 148, sort: 1 },
        { key: "A5 hoch", width: 297, height: 210, sort: 2 },
        { key: "A6 quer", width: 296, height: 105, sort: 3 },
        { key: "A6 hoch", width: 210, height: 148, sort: 4 },
        { key: "lang M hoch 105 x 210 mm", width: 210, height: 210, sort: 7 },
        { key: "lang M quer 210 x 105 mm", width: 420, height: 105, sort: 8 },
        {
          key: "lang L hoch 105 x 297 mm",
          width: 210,
          height: 297,
          sort: 9
        },
        { key: "Quadrat 100 x 100 mm", width: 200, height: 100, sort: 10 },
        { key: "Quadrat 120 x 120 mm", width: 240, height: 120, sort: 11 },
        { key: "Quadrat 140 x 140 mm", width: 280, height: 140, sort: 12 },
        { key: "Quadrat 210 x 210 mm", width: 420, height: 210, sort: 13 }
      ]
      await Promise.all(
        DATA.map(async (obj) => {
          const thisStatus = await this.findOneByCondition(obj)
          if (!thisStatus) {
            const createInventoryStatus = await this.createObject(obj)
          }
        })
      )
    } catch (error) {
      return error
    }
  }
})(Model)

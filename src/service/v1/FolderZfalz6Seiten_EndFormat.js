/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/FolderZfalz6Seiten_EndFormat")

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "A5 hoch", width: 442, height: 210, sort: 0 },
        { key: "A6 hoch", width: 315, height: 148, sort: 1 },
        { key: "A6 quer", width: 445, height: 105, sort: 2 },
        { key: "A7 hoch", width: 222, height: 105, sort: 3 },
        { key: "A7 quer", width: 313, height: 74, sort: 4 },
        { key: "lang M hoch 99 x 210 mm", width: 297, height: 210, sort: 5 },
        { key: "lang L hoch 99 x 297 mm", width: 297, height: 297, sort: 6 },
        { key: "Quadrat 100 x 100 mm", width: 298, height: 100, sort: 7 },
        { key: "Quadrat 120 x 120 mm", width: 360, height: 120, sort: 8 },
        { key: "Quadrat 140 x 140 mm", width: 420, height: 140, sort: 9 },
        {
          key: "SF 1/3 A3 140 x 297 mm",
          width: 420,
          height: 297,
          sort: 6
        }
      ]
      await Promise.all(
        DATA.map(async (obj) => {
          const thisStatus = await this.findOneByCondition({ sort: obj.sort })
          if (!thisStatus) {
            const createInventoryStatus = await this.createObject(obj)
          } else {
            await this.update({ _id: thisStatus._id }, obj)
          }
        })
      )
    } catch (error) {
      return error
    }
  }
})(Model)

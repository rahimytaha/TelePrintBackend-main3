/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/FolderZfalz8Seiten_EndFormat")

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "A6 hoch", width: 420, height: 148, sort: 0 },
        { key: "A7 hoch", width: 296, height: 105, sort: 1 },
        { key: "A7 quer", width: 420, height: 74, sort: 1.2 },
        { key: "Lang S hoch 99 x 210 mm", width: 396, height: 210, sort: 2 },
        { key: "lang M hoch 210 x 105 mm", width: 210, height: 420, sort: 2.5 },
        { key: "lang L hoch 105 x 297 mm", width: 297, height: 420, sort: 3 },
        { key: "Quadrat 99 x 99 mm", width: 396, height: 99, sort: 4 }
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

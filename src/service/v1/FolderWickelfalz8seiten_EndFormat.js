/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/FolderWickelfalz8seiten_EndFormat")

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "A6 hoch", width: 414, height: 148, sort: 0 },
        { key: "A7 hoch", width: 289, height: 105, sort: 1 },
        { key: "A7 quer", width: 413, height: 74, sort: 2 },
        { key: "lang M hoch 105 x 210 mm", width: 418, height: 210, sort: 3 },
        { key: "lang L hoch 105 x 297 mm", width: 418, height: 297, sort: 4 },
        { key: "Quadrat 100 x 100 mm", width: 398, height: 100, sort: 5 }
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

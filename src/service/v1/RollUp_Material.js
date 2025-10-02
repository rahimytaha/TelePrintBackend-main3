/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/RollUp_Material");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        {
          slopeOneSided: 0.066637228,
          slopeTwoSided: 0.10324685,
          key: "Banner/Transparente",
          price: 2 * 0.0284,
          sort: 0,
        },
        {
          slopeOneSided: 0.072356312,
          slopeTwoSided: 0.10990896,
          key: "Display Film 190µ",
          price: 2 * 0.0318,
          sort: 1,
        },
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

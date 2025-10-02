/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Lesezeichen_Material");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        {
          slopeOneSided: 0.120566319,
          slopeTwoSided: 0.162588415,
          key: "200g Biotop naturweiß",
          price: 2 * 0.0626,
          isCellophane: true,
          sort: 0,
        },
        {
          slopeOneSided: 0.136766963,
          slopeTwoSided: 0.17858304,
          key: "250g Biotop naturweiß",
          price: 2 * 0.074,
          isCellophane: true,
          sort: 1,
        },
        {
          slopeOneSided: 0.155447798,
          slopeTwoSided: 0.195635796,
          key: "300g Biotop naturweiß",
          price: 2 * 0.088,
          isCellophane: true,
          sort: 2,
        },
        {
          slopeOneSided: 0.152861089,
          slopeTwoSided: 0.193374475,
          key: "250g Color Copy",
          price: 2 * 0.086,
          isCellophane: true,
          sort: 3,
        },
        {
          slopeOneSided: 0.182098006,
          slopeTwoSided: 0.216664998,
          key: "300g Color Copy",
          price: 2 * 0.132,
          isCellophane: true,
          sort: 4,
        },
        {
          slopeOneSided: 0.2131104,
          slopeTwoSided: 0.23398,
          key: "350g Color Copy",
          price: 2 * 0.168,
          isCellophane: true,
          sort: 5,
        },
        {
          slopeOneSided: 0.101627377,
          slopeTwoSided: 0.142707823,
          key: "250g Magno Glossy",
          price: 2 * 0.05,
          isCellophane: true,
          sort: 6,
        },
        {
          slopeOneSided: 0.122603694,
          slopeTwoSided: 0.164654626,
          key: "300g Magno Glossy",
          price: 2 * 0.064,
          isCellophane: true,
          sort: 7,
        },

        {
          slopeOneSided: 0.133988964,
          slopeTwoSided: 0.175913882,
          key: "350g Magno Glossy",
          price: 2 * 0.072,
          isCellophane: true,
          sort: 8,
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

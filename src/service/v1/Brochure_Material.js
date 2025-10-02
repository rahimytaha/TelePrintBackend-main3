/** @format */

const BaseService = require("../baseService")
const Model = require("../../model/v1/Brochure_Material")

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        {
          slopeOneSided: 0.055657647,
          slopeTwoSided: 0.090249631,
          key: "80g Biotop naturweiß",
          price: 0.044,
          sort: 0,
          max: 81,
          isCellophane: false
        },
        {
          slopeOneSided: 0.066637228,
          slopeTwoSided: 0.10324685,
          key: "100g Biotop naturweiß",
          price: 0.0568,
          sort: 1,
          max: 81,
          isCellophane: false
        },
        {
          slopeOneSided: 0.098521451,
          slopeTwoSided: 0.139339515,
          key: "160g Biotop naturweiß",
          price: 0.096,
          sort: 2,
          max: 61,
          isCellophane: false
        },
        {
          slopeOneSided: 0.120566319,
          slopeTwoSided: 0.162588415,
          key: "200g Biotop naturweiß",
          price: 0.1252,
          isCellophane: true,
          sort: 3,
          max: 21
        },
        {
          slopeOneSided: 0.136766963,
          slopeTwoSided: 0.17858304,
          key: "250g Biotop naturweiß",
          price: 0.148,
          isCellophane: true,
          sort: 4,
          max: 21
        },
        {
          slopeOneSided: 0.155447798,
          slopeTwoSided: 0.195635796,
          key: "300g Biotop naturweiß",
          price: 0.176,
          isCellophane: true,
          sort: 5,
          max: 21
        },
        {
          slopeOneSided: 0.072356312,
          slopeTwoSided: 0.10990896,
          key: "100g Color Copy",
          price: 0.0636,
          sort: 6,
          max: 81,
          isCellophane: false
        },
        {
          slopeOneSided: 0.085824478,
          slopeTwoSided: 0.12528366,
          key: "120g Color Copy",
          price: 0.08,
          sort: 7,
          max: 61,
          isCellophane: false
        },
        {
          slopeOneSided: 0.104705975,
          slopeTwoSided: 0.146017868,
          key: "160g Color Copy",
          price: 0.104,
          sort: 8,
          max: 41,
          isCellophane: false
        },
        {
          slopeOneSided: 0.152861089,
          slopeTwoSided: 0.193374475,
          key: "250g Color Copy",
          price: 0.172,
          isCellophane: true,
          sort: 9,
          max: 21
        },
        {
          slopeOneSided: 0.182098006,
          slopeTwoSided: 0.216664998,
          key: "300g Color Copy",
          price: 0.264,
          isCellophane: true,
          sort: 10,
          max: 21
        },
        {
          slopeOneSided: 0.2131104,
          slopeTwoSided: 0.23398,
          key: "350g Color Copy",
          price: 0.336,
          isCellophane: true,
          sort: 11,
          max: 21
        },
        {
          slopeOneSided: 0.059118826,
          slopeTwoSided: 0.094375351,
          key: "115g Magno Glossy",
          price: 0.048,
          sort: 12,
          max: 61,
          isCellophane: false
        },

        {
          slopeOneSided: 0.062552678,
          slopeTwoSided: 0.098442808,
          key: "135g Magno Glossy",
          price: 0.052,
          sort: 13,
          max: 41,
          isCellophane: false
        },

        {
          slopeOneSided: 0.072690269,
          slopeTwoSided: 0.110295605,
          key: "170g Magno Glossy",
          price: 0.064,
          sort: 14,
          max: 41,
          isCellophane: true
        },

        {
          slopeOneSided: 0.101627377,
          slopeTwoSided: 0.142707823,
          key: "250g Magno Glossy",
          price: 0.1,
          isCellophane: true,
          sort: 15,
          max: 21
        },

        {
          slopeOneSided: 0.122603694,
          slopeTwoSided: 0.164654626,
          key: "300g Magno Glossy",
          price: 0.128,
          isCellophane: true,
          sort: 16,
          max: 21
        },

        {
          slopeOneSided: 0.133988964,
          slopeTwoSided: 0.175913882,
          key: "350g Magno Glossy",
          price: 0.144,
          isCellophane: true,
          sort: 17,
          max: 21
        }
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

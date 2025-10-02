/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/PrintyDatumstempel_Art");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        {
          key: "4724 (40 x 40) mm",
          productKey: "4724",
          isRound: false,
          completePrice: 49.2,
          platePrice: 27,
        },
        {
          key: "4726 (75 x 26) mm",
          productKey: "4726",
          isRound: false,
          completePrice: 66,
          platePrice: 36,
        },
        {
          key: "4727 (60 x 40) mm",
          productKey: "4727",
          isRound: false,
          completePrice: 57.6,
          platePrice: 37.8,
        },
        {
          key: "4729 (50 x 30) mm",
          productKey: "4729",
          isRound: false,
          completePrice: 45.6,
          platePrice: 29.4,
        },
        {
          key: "4731 (70 x 30) mm",
          productKey: "4731",
          isRound: false,
          completePrice: 64.8,
          platePrice: 33,
        },
        {
          key: "4750 (41 x 24) mm",
          productKey: "4750",
          isRound: false,
          completePrice: 37.2,
          platePrice: 30,
        },
        {
          key: "4813 (26 x 9) mm",
          productKey: "4813",
          isRound: false,
          completePrice: 25.2,
          platePrice: 13.2,
        },
        {
          key: "4850 (25 x 5) mm",
          productKey: "4850",
          isRound: false,
          completePrice: 20.4,
          platePrice: 13.2,
        },
        {
          key: "46130 (30 Ø ) mm",
          productKey: "46130",
          isRound: true,
          completePrice: 66.6,
          platePrice: 28.2,
        },
        {
          key: "46140 (40 Ø ) mm",
          productKey: "46140",
          isRound: true,
          completePrice: 67.2,
          platePrice: 33.6,
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

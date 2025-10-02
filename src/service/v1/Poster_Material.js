/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Poster_Material");

module.exports = new (class serviceModel extends BaseService {
  async initialize() {
    try {
      const DATA = [
        {
          key: "135 g/m² Satin",
          price: 1,
          sort: 0,
        },
        {
          key: "Satin 200g",
          price: 1.5,
          sort: 1,
        },
        {
          key: "Fotopapier 220g",
          price: 4,
          sort: 2,
        },
        {
          key: "Tapetenpapier",
          price: 4,
          sort: 3,
        },
        {
          key: "Backlit Folie",
          price: 5,
          sort: 4,
        },
        {
          key: "Folie klar (max. 127cm)",
          price: 8,
          sort: 5,
        },
        {
          key: "Folie klar SK",
          price: 5,
          sort: 6,
        },
        {
          key: "Sandstrahl Folie SK",
          price: 9,
          sort: 7,
        },
        {
          key: "Transluzent Folie SK",
          price: 6.5,
          sort: 8,
        },
        {
          key: "Fensterloch Folie SK",
          price: 12,
          sort: 9,
        },
        {
          key: "Klebefolie matt/glossy",
          price: 2,
          sort: 10,
        },
        {
          key: "Textil/Fahne",
          price: 10.5,
          sort: 11,
        },
        {
          key: "Leinen/Canvas",
          price: 8,
          sort: 12,
        },
        {
          key: "Plane/Banner",
          price: 4,
          sort: 13,
        },
        {
          key: "Hart PVC 450µ",
          price: 9,
          sort: 14,
        },
        {
          key: "Display Film 190µ",
          price: 8,
          sort: 15,
        },
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

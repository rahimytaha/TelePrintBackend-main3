const BaseService = require("../baseService")
const CategoryModel = require("../../model/v1/Category")

module.exports = new (class CategoryService extends BaseService {
  async initialize() {
    try {
      const DATA = [
        { key: "Werbedrucksorten", du_name: "Werbedrucksorten", en_name: "Werbedrucksorten", sort: 0, description: "Werbedrucksorten" },
        { key: "Burodrucksorten", du_name: "Bürodrucksorten", en_name: "Burodrucksorten", sort: 1, description: "Bürodrucksorten" },
        { key: "Buchdruck", du_name: "Buchdruck", en_name: "Buchdruck", sort: 2, description: "Buchdruck" },
        {
          key: "Etiketten_Klebefolien_Sticker",
          du_name: "Etiketten-Klebefolien-Sticker",
          en_name: "Etiketten-Klebefolien-Sticker",
          sort: 3,
          description: "Etiketten-Klebefolien-Sticker"
        },
        {
          key: "Fotodruck",
          du_name: "Fotodruck",
          en_name: "Fotodruck",
          sort: 4,
          description: "Fotodruck"
        },
        { key: "Werbetechnik", du_name: "Werbetechnik", en_name: "Werbetechnik", sort: 0, description: "Werbetechnik" }
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
})(CategoryModel)

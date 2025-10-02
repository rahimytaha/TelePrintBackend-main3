const BaseView = require("../../BaseView")
const ImageView = require("./ImageView")

const CategoryView = require("./CategoryView")

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      category:
        item.categoryId && item.categoryId._id
          ? CategoryView.transform(item.categoryId)
          : item.categoryId,

      key: item.key,
      description: item.description,
      images: item.Images && item.Images.length ? ImageView.transformCollection(item.Images) : []
    }
  }
})()

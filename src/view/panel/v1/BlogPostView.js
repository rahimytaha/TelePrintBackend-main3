/** @format */

const BaseView = require("../../BaseView")

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      title: item.title,
      slug: item.slug,
      content: item.content,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
      coverImageUrl: item.coverImageUrl,
      sort: item.sort
    }
  }
})()

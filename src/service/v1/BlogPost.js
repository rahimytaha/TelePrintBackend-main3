const BaseService = require("../baseService")
const BlogPostModel = require("../../model/v1/BlogPost")

module.exports = new (class BlogPostService extends BaseService {})(BlogPostModel)

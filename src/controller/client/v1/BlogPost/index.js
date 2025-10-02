/** @format */

const BaseController = require("../../../BaseController")
const BlogPostService = require("../../../../service/v1/BlogPost")
const BlogPostView = require("../../../../view/client/v1/BlogPostView")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const { isValidObjectId } = require("mongoose")

module.exports = new (class BlogPostController extends BaseController {
  async getAll(req, res) {
    try {
      const BlogPosts = await BlogPostService.findAllAndPopulate({})
      if (BlogPosts && BlogPosts.length) {
        return res.status(200).json({
          data: BlogPostView.transformCollection(BlogPosts)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "شیوه ارسالی ثبت نشده است."
        })
      }
    } catch (err) {
      console.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getById(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          data: {},
          message: "Id is required"
        })
      }
      const condition = isValidObjectId(req.params.id) ? { $or: [{ _id: req.params.id }, { slug: req.params.id }] } : { slug: req.params.id }
      const BlogPost = await BlogPostService.findOneByCondition(condition)

      if (BlogPost) {
        return res.status(200).json({
          data: BlogPostView.transform(BlogPost)
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "Id is wrong"
        })
      }
    } catch (err) {
      console.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

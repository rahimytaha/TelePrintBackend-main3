/** @format */

const BaseController = require("../../../BaseController")
const BlogPostService = require("../../../../service/v1/BlogPost")
const BlogPostView = require("../../../../view/panel/v1/BlogPostView")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const { paginationTools } = require("../../../../util")
module.exports = new (class BlogPostController extends BaseController {
  async create(req, res) {
    try {
      const object = {
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        coverImageUrl: req.file ? BASE_URL_FOR_MULTER + "/blog/" + req.file.filename : "",
        sort: req.body.sort
      }
      const existBlogPost = await BlogPostService.findOneByCondition({
        slug: req.body.slug
      })
      if (existBlogPost) {
        return res.status(400).json({
          data: "",
          message: "قبلا ثبت شده"
        })
      }

      const createBlogPost = await BlogPostService.createObject(object)

      if (createBlogPost) {
        return res.status(201).json({
          data: BlogPostView.transform(createBlogPost),
          message: "Dieser Blog-Beitrag wurde bereits erstellt."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "Der Blog-Beitrag konnte nicht erstellt werden."
        })
      }
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren Sie uns, falls das Problem bestehen bleibt."
      })
    }
  }

  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, sort, condition } = req.body

      // شرط جستجو
      const newCondition = { ...condition, isDeleted: { $ne: true } }

      // محاسبه skip
      const skip = (page - 1) * limit

      // دریافت لیست BlogPostها
      const blogPosts = await BlogPostService.model
        .find(newCondition)
        .sort(sort ? sort : { createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate([
          {
            path: "authorId" // مثلا اگر BlogPost نویسنده دارد
          },
          {
            path: "categories" // اگر دسته‌بندی دارد
          }
        ])

      if (blogPosts && blogPosts.length) {
        return res.status(200).json({
          data: BlogPostView.transformCollection(blogPosts),
          message: "Die Blog-Beiträge wurden erfolgreich geladen."
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "Es sind keine Blog-Beiträge vorhanden."
        })
      }
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren Sie uns, falls das Problem bestehen bleibt.",
        success: false
      })
    }
  }

  async getAllMetaData(req, res) {
    try {
      const { page = 1, limit = 10, condition } = req.body

      const newCondition = { ...condition, isDeleted: { $ne: true } }

      // تعداد کل BlogPostها
      const totalBlogPosts = await BlogPostService.model.find(newCondition).countDocuments()
      const metaData = paginationTools(totalBlogPosts, page, limit)

      return res.status(200).json({
        metaData: metaData
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren Sie uns, falls das Problem bestehen bleibt."
      })
    }
  }

  async getById(req, res) {
    try {
      if (!req.params.id) {
        return res.status(400).json({
          data: {},
          message: "Die ID ist erforderlich."
        })
      }
      const BlogPost = await BlogPostService.findOneByCondition({
        _id: req.params.id
      })

      if (BlogPost) {
        return res.status(200).json({
          data: BlogPostView.transform(BlogPost),
          message: "Der Blog-Beitrag wurde erfolgreich abgerufen."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "Der Blog-Beitrag wurde nicht gefunden."
        })
      }
    } catch (err) {
      console.error(err)
      return res.status(500).json({
        data: err,
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren Sie uns, falls das Problem bestehen bleibt."
      })
    }
  }

  async deleteBlogPost(req, res) {
    try {
      const deletedBlogPost = await BlogPostService.softDelete({ _id: req.params.id }, req.admin.userName)
      if (deletedBlogPost) {
        const deleteBlogPost = await BlogPostView.transform(deletedBlogPost)
        return res.status(200).json({
          data: deleteBlogPost,
          message: "Der Blog-Beitrag wurde erfolgreich gelöscht."
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "Der Blog-Beitrag wurde nicht gefunden."
        })
      }
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte kontaktieren Sie uns, falls das Problem bestehen bleibt."
      })
    }
  }

  async updateBlogPost(req, res) {
    try {
      const existingBlogPost = await BlogPostService.findById(req.params.id)

      if (!existingBlogPost) {
        return res.status(400).json({
          data: "",
          message: "Der angegebene Blog-Beitrag wurde nicht gefunden."
        })
      }

      if (req.body.slug && req.body.slug !== existingBlogPost.slug) {
        const slugExists = await BlogPostService.findOneByCondition({
          slug: req.body.slug
        })
        if (slugExists) {
          return res.status(400).json({
            data: "",
            message: "Ein Blog-Beitrag mit diesem Slug existiert bereits."
          })
        }
      }

      const updatedObject = {
        title: req.body.title || existingBlogPost.title,
        slug: req.body.slug || existingBlogPost.slug,
        content: req.body.content || existingBlogPost.content,
        metaTitle: req.body.metaTitle || existingBlogPost.metaTitle,
        metaDescription: req.body.metaDescription || existingBlogPost.metaDescription,
        coverImageUrl: req.file ? BASE_URL_FOR_MULTER + "/blog/" + req.file.filename : existingBlogPost.coverImageUrl,
        sort: req.body.sort || existingBlogPost.sort
      }

      const updatedBlogPost = await BlogPostService.update({ _id: req.params.id }, updatedObject, true)

      if (updatedBlogPost) {
        return res.status(200).json({
          data: BlogPostView.transform(updatedBlogPost),
          message: "Der Blog-Beitrag wurde erfolgreich aktualisiert."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "Der Blog-Beitrag konnte nicht aktualisiert werden."
        })
      }
    } catch (error) {
      return res.status(500).json({
        data: error,
        message: "Ein unerwarteter Fehler ist aufgetreten. Bitte überprüfen Sie Ihr Benutzerkonto oder kontaktieren Sie uns per E‑Mail oder Telefon."
      })
    }
  }
})()

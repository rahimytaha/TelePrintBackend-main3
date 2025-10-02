/** @format */

const BaseController = require("../../../BaseController")
const ProductService = require("../../../../service/v1/Product")

const CategoryService = require("../../../../service/v1/Category")
const ProductView = require("../../../../view/panel/v1/ProductView")
const ImageService = require("../../../../service/v1/Image")

const { GeneralPanel } = require("../../../../log")

module.exports = new (class ProductController extends BaseController {
  async create(req, res) {
    try {
      const existCategoryId = await CategoryService.findOneByCondition({
        _id: req.body.categoryId
      })
      if (!existCategoryId) {
        return res.status(400).json({
          data: "",
          message: "شناسه دسته بندی اشتباه است"
        })
      }

      const object = {
        categoryId: req.body.categoryId,
        key: req.body.key,
        description: req.body.description
      }

      const createProduct = await ProductService.createObject(object)

      await ImageService.handleImageArray("Product", createProduct._id, req.body.addImage, req.body.removeImage)

      const Images = await ImageService.findImage("Product", createProduct._id)

      if (createProduct) {
        return res.status(201).json({
          data: ProductView.transform({
            ...createProduct._doc,
            Images: Images
          }),
          message: "محصول ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "محصول قابل ثبت نیست."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getAll(req, res) {
    try {
      const Products = await ProductService.findAllAndPopulateWithPaginationAndImage({}, req.params, "Product", [
        {
          path: "categoryId",
          model: "Category"
        }
      ])

      if (Products && Products.data.length) {
        return res.status(200).json({
          data: ProductView.transformCollection(Products.data),
          metaData: Products.metaData
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "محصولی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getById(req, res) {
    try {
      const Product = await ProductService.findOneByCondition({
        _id: req.params.id
      })

      if (Product) {
        return res.status(200).json({
          data: ProductView.transform(Product)
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "آیدی اشتباه است"
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async deleteProduct(req, res) {
    try {
      const deletedProduct = await ProductService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedProduct) {
        const deleteProduct = await ProductView.transform(deletedProduct)
        return res.status(200).json({
          data: deleteProduct,
          message: "محصول مورد نظر حذف شد"
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "محصول یافت نشد"
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async updateProduct(req, res) {
    try {
      //! check send Id is true
      const existObject = await ProductService.findById(req.params.id)

      if (!existObject) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }
      if (req.body.categoryId) {
        const existCategoryId = await CategoryService.findOneByCondition({
          _id: req.body.categoryId
        })
        if (!existCategoryId) {
          return res.status(400).json({
            data: "",
            message: "شناسه پدر اشتباه است"
          })
        }
      }

      const object = {
        categoryId: req.body.categoryId || existObject.categoryId,

        key: req.body.key || existObject.key,
        description: req.body.description || existObject.description
      }

      await ImageService.handleImageArray("Product", req.params.id, req.body.addImage, req.body.removeImage)

      const Images = await ImageService.findImage("Product", req.params.id)

      const updateProduct = await ProductService.update({ _id: req.params.id }, object, true)

      if (updateProduct) {
        return res.status(200).json({
          data: ProductView.transform({
            ...updateProduct._doc,
            Images: Images
          }),
          message: "محصول ویرایش شد."
        })
      }
    } catch (error) {
      GeneralPanel.error(error)
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

/** @format */

const BaseController = require("../../../BaseController")
const ProductService = require("../../../../service/v1/Product")
const ProductView = require("../../../../view/client/v1/ProductView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class ProductController extends BaseController {
  async getAll(req, res) {
    try {
      const Products = await ProductService.ProductWithProductService({})
      if (Products && Products.length) {
        return res.status(200).json({
          data: ProductView.transformCollection(Products),
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

  async getAllByQuery(req, res) {
    try {
      const { categoryId, q } = req.body

      let Products = await ProductService.ProductWithProductService({
        categoryId: categoryId ? categoryId : { $ne: null },
        key: q ? { $regex: q } : { $ne: "" },
        q: null
      })

      if (Products && Products.length) {
        return res.status(200).json({
          data: ProductView.transformCollection(Products)
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
      const Product = await ProductService.findOneByConditionAndPopulateWithImage(
        {
          _id: req.params.id
        },
        "Product",
        [
          {
            path: "taxId",
            model: "Tax"
          },
          {
            path: "producerId",
            model: "Producer"
          },
          {
            path: "statusId",
            model: "ProductStatus"
          },
          {
            path: "categoryId",
            model: "Category"
          },
          {
            path: "inventoryStatusId",
            model: "InventoryStatus"
          },
          {
            path: "brandId",
            model: "Brand"
          }
        ]
      )
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
})()

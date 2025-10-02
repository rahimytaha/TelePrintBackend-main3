/** @format */

const BaseService = require("../baseService");
const ProductModel = require("../../model/v1/Product");

module.exports = new (class ProductService extends BaseService {
  async ProductWithProductService(condition) {
    try {
      const Products = await this.findAllAndPopulateImage(condition, "Product", [
        {
          path: "categoryId",
          model: "Category",
        },
      ]);

      return Products;
    } catch (error) {
      return error;
    }
  }
  async oneProductWithImage(Product) {
    const thisProduct = await this.findOneByConditionAndPopulateWithImage(
      { _id: Product._id },
      "Product",
      [
        {
          path: "categoryId",
          model: "Category",
        },
      ],
    );
    return thisProduct;
  }
  async oneProductWithImageCondition(condition) {
    const thisProduct = await this.findOneByConditionAndPopulateWithImage(condition, "Product", [
      {
        path: "categoryId",
        model: "Category",
      },
    ]);
    return thisProduct;
  }
})(ProductModel);

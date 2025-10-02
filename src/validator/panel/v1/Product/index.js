const ProductService = require("../../../../service/v1/Product");

module.exports = new (class ProductController {
  async deleteProduct(req, res) {
    const existObject = await ProductService.findOneByCondition({ _id: req.params.id });

    if (!existObject) {
      res.status(400).json({
        data: "",
        message: "آیدی اشتباه است",
      });
      return true;
    }
  }

  async updateProduct(req, res) {
    const existObject = await ProductService.findOneByCondition({ _id: req.params.id });

    if (!existObject) {
      res.status(400).json({
        data: "",
        message: "آیدی اشتباه است",
      });
      return true;
    }
  }
})();

const ProductPricingService = require("../../../../service/v1/ProductPricing");
const ProductService = require("../../../../service/v1/Product");

module.exports = new (class ProductPricingController {
  async create(req, res) {
    const existProductId = await ProductService.findOneByCondition({
      _id: req.body.productId,
    });

    if (!existProductId) {
      return res.status(400).json({
        data: "",
        message: "شناسه محصول اصلی اشتباه است",
      });
    }
  }

  async deleteProductPricing(req, res) {
    const existUser = await ProductPricingService.findById(req.params.id);

    if (!existUser) {
      res.status(400).json({
        data: "",
        message: "آیدی اشتباه است",
      });
      return true;
    }
  }

  async updateProductPricing(req, res) {
    //! check send Id is true
    const existUser = await ProductPricingService.findById(req.params.id);

    if (!existUser) {
      res.status(400).json({
        data: "",
        message: "آیدی اشتباه است",
      });
      return true;
    }
    if (req.body.productId) {
      const existProductId = await ProductService.findOneByCondition({
        _id: req.body.productId,
      });

      if (!existProductId) {
        res.status(400).json({
          data: "",
          message: "شناسه محصول اصلی اشتباه است",
        });
        return true;
      }
    }
  }
})();

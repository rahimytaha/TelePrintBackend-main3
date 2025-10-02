/** @format */

const BaseService = require("../baseService");
const Model = require("../../model/v1/Poster_Record");

module.exports = new (class serviceModel extends BaseService {
  calculatorPrice(req, Material) {
    const { count, width, height } = req.body;
    const SA = this.SA(count, width, height);
    if (59 <= SA) {
      return 0;
    }
    const PrintPrice = this.calculatorPrintPrice(SA);
    const finalPrice = PrintPrice + SA * Material.price;
    return Math.ceil(finalPrice);
  }
  calculatorPrintPrice(SA) {
    if (SA <= 5) {
      return SA * 36;
    }
    if (5 < SA && SA <= 10) {
      return SA * 31;
    }
    if (11 <= SA && SA <= 15) {
      return SA * 29;
    }
    if (15 < SA && SA <= 20) {
      return SA * 27.5;
    }
    if (SA === 21) {
      return SA * 26.5;
    }
    if (SA === 22) {
      return SA * 25.5;
    }
    if (SA === 23) {
      return SA * 24.5;
    }
    if (SA === 24) {
      return SA * 24;
    }
    if (SA === 25) {
      return SA * 23.5;
    }
    if (SA === 26) {
      return SA * 23;
    }
    if (SA === 27) {
      return SA * 22.5;
    }
    if (SA === 28) {
      return SA * 22;
    }
    if (29 <= SA && SA <= 40) {
      return SA * 21.5;
    }
    if (40 < SA && SA < 50) {
      return SA * 6.5 + 630;
    }
    if (50 <= SA && SA <= 58) {
      return SA * 18.5;
    }

    if (59 <= SA && SA <= 156) {
      return SA * 16.9 + 93;
    }
    if (157 <= SA && SA <= 208) {
      return SA * 16 + 230;
    }
    if (208 < SA) {
      return SA * 12 + 1060;
    }
  }
  SA(count, width, height) {
    const SAResult = (count * width * height) / (1189 * 841);
    return Math.ceil(SAResult);
  }
})(Model);

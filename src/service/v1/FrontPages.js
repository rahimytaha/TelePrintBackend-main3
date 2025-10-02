const BaseService = require("../baseService")
const FrontPagesModel = require("../../model/v1/FrontPages")

module.exports = new (class FrontPagesService extends BaseService {})(FrontPagesModel)

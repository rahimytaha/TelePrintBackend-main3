/** @format */

const BaseService = require("../baseService");
const AddressModel = require("../../model/v1/Address");

module.exports = new (class AddressService extends BaseService {})(AddressModel);

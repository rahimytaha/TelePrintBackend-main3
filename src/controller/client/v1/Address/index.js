/** @format */

const AddressService = require("../../../../service/v1/Address");
const AddressView = require("../../../../view/client/v1/Address");
const { GeneralFront } = require("../../../../log");

module.exports = new (class AddressController {
  async create(req, res) {
    try {
      const Addressexist = await AddressService.findOneByCondition({
        name: req.body.name,
        userId: req.user._id,
      });
      if (Addressexist) {
        return res.status(400).json({
          data: {},
          message: "This name has been saved before",
        });
      }
      const object = {
        name: req.body.name,
        userId: req.user._id,
        postalCode: req.body.postalCode,
        country: req.body.country,
        address: req.body.address,
        street: req.body.street,
        state: req.body.state,
      };
      const createAddress = await AddressService.createObject(object);

      if (!createAddress) {
        return res.status(400).json({
          data: {},
          message: "آدرس قابل ثبت نیست.",
        });
      }
      return res.status(201).json({
        data: AddressView.transform(createAddress),
      });
    } catch (err) {
      return res.status(500).json({
        data: err,
        message: "a problem has been happened.",
      });
    }
  }

  async getAll(req, res) {
    try {
      const Address = await AddressService.findAll({
        userId: req.user._id,
      });

      if (Address && Address.length) {
        return res.status(200).json({
          data: AddressView.transformCollection(Address),
        });
      } else {
        return res.status(204).json({
          data: [],
          message: "آدرسی ثبت نشده است.",
        });
      }
    } catch (err) {
      GeneralFront.error(err);

      return res.status(500).json({
        data: err,
        message: "a problem has been happened.",
      });
    }
  }

  async delete(req, res) {
    try {
      const deletedAddress = await AddressService.softDelete({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (deletedAddress) {
        const deleteAddress = await AddressView.transform(deletedAddress);
        return res.status(200).json({
          data: deleteAddress,
          message: "آدرس مورد نظر حذف شد",
        });
      } else {
        return res.status(404).json({
          data: {},
          message: "آدرس یافت نشد",
        });
      }
    } catch (err) {
      GeneralFront.error(err);

      return res.status(500).json({
        data: err,
        message: "a problem has been happened.",
      });
    }
  }

  async update(req, res) {
    try {
      //! check send Id is true
      const existAdress = await AddressService.findOneByCondition({
        _id: req.params.id,
        userId: req.user._id,
      });

      if (!existAdress) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است",
        });
      }

      const object = {
        name: req.body.name || existAdress.name,
        postalCode: req.body.postalCode || existAdress.postalCode,
        country: req.body.country || existAdress.country,
        address: req.body.address || existAdress.address,
        street: req.body.street || existAdress.street,
        state: req.body.state || existAdress.state,
      };

      const updateAddress = await AddressService.update(
        {
          _id: req.params.id,
          userId: req.user._id,
        },
        object,
        true,
      );

      if (updateAddress) {
        return res.status(200).json({
          data: AddressView.transform(updateAddress),
          message: "آدرس ویرایش شد.",
        });
      }
    } catch (error) {
      GeneralFront.error(error);
      return res.status(500).json({
        data: error,
        message: "a problem has been happened.",
      });
    }
  }
})();

/** @format */

const OrderStatusService = require("../../../../service/v1/OrderStatus")
const OrderStatusView = require("../../../../view/panel/v1/OrderStatus")

module.exports = new (class Controller {
  async create(req, res) {
    try {
      const object = {
        en_name: req.body.en_name,
        du_name: req.body.du_name,
        description: req.body.description,
        sort: req.body.sort,
        key: req.body.key
      }

      const createObject = await OrderStatusService.createObject(object)

      if (!createObject) {
        return res.status(400).json({
          data: {},
          message: "Error during the submitting"
        })
      }
      return res.status(201).json({
        data: OrderStatusView.transform(createObject),
        message: "Created"
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }

  async Initialize(req, res) {
    try {
      const createObject = await OrderStatusService.Initialize()

      if (!createObject) {
        return res.status(400).json({
          data: {},
          message: "Error during the submitting"
        })
      }
      return res.status(201).json({
        data: OrderStatusView.transform(createObject),
        message: "Created"
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }

  async getAll(req, res) {
    try {
      const Objects = await OrderStatusService.model
        .find({ isDeleted: { $ne: true } })
        .sort({ sort: 1 })
        .exec()

      if (!Objects || !Objects.length) {
        return res.status(204).json({
          data: [],
          message: "No Data Found"
        })
      }

      return res.status(200).json({
        data: OrderStatusView.transformCollection(Objects)
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }

  async getById(req, res) {
    try {
      const Object = await OrderStatusService.findOneByConditionAndPopulate(
        {
          _id: req.params.id
        },
        [{ path: "validStatus" }]
      )

      if (!Object) {
        return res.status(204).json({
          data: "",
          message: "No Data Found"
        })
      }
      return res.status(200).json({
        data: OrderStatusView.transform(Object)
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }

  async getAllByQuery(req, res) {
    try {
      const Objects = await OrderStatusService.findAllAndPopulate(req.body)

      if (!Objects || !Objects.length) {
        return res.status(204).json({
          data: [],
          message: "No Data Found"
        })
      }
      return res.status(200).json({
        data: OrderStatusView.transform(Objects)
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }

  async update(req, res) {
    try {
      const existObject = await OrderStatusService.findOneByCondition({
        _id: req.params.id
      })

      if (!existObject) {
        return res.status(400).json({
          data: "",
          message: "The id is wrong"
        })
      }

      const object = {
        en_name: req.body.en_name ? req.body.en_name : existObject.en_name,
        du_name: req.body.du_name ? req.body.du_name : existObject.du_name,
        description: req.body.description ? req.body.description : existObject.description,
        sort: req.body.sort ? req.body.sort : existObject.sort,
        key: req.body.key ? req.body.key : existObject.key
      }

      const updatedObject = await OrderStatusService.update({ _id: req.params.id }, object, true)
      return res.status(200).json({
        data: OrderStatusView.transform(updatedObject),
        message: "The name and the code must be unique"
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }

  async softDelete(req, res) {
    try {
      const deletedProduct = await OrderStatusService.softDelete({ _id: req.params.id }, req.admin.username)

      if (deletedProduct) {
        const deleteProduct = await OrderStatusView.transform(deletedProduct)
        return res.status(200).json({
          data: deleteProduct,
          message: "Ok"
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "Id is wrong"
        })
      }
    } catch (err) {
      const logRecordProgrammer = {
        methodName: "softDelete",
        className: "OrderStatus",
        sectionName: "client",
        layerName: "controller",
        version: "v1",
        userId: req?.user?._id,
        body: JSON.stringify(req?.body),
        params: JSON.stringify(req?.params),
        errorJson: JSON.stringify(err)
      }
      await LogProgrammerService.createObject(logRecordProgrammer)
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }
})()

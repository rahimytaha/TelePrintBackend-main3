/** @format */

const BaseService = require("../baseService")
const CartModel = require("../../model/v1/Cart")
const OrderStatusService = require("./OrderStatus")
const { removeDuplicate } = require("../../util")

module.exports = new (class CartService extends BaseService {
  async findActiveCart(req) {
    try {
      let ReservedStatus = await OrderStatusService.findOneByCondition({
        key: "Reserved"
      })
      let existOrder = await this.findOneByCondition({
        userId: req.user._id,
        statusId: ReservedStatus._id
      })

      return { existOrder, ReservedStatus }
    } catch (error) {
      return { hasError: true, errorObject: error }
    }
  }
  async createCart(req, orderItem, orderProduct) {
    try {
      let { existOrder, ReservedStatus } = await this.findActiveCart(req)
      if (!existOrder) {
        const cartObject = {
          userId: req.user._id,
          statusId: ReservedStatus._id,
          orderItems: [orderItem._id],
          finalPrice: orderProduct.finalPrice,
          priceWithOutTax: orderProduct.priceWithOutTax,
          Tax: orderProduct.Tax
        }

        existOrder = await this.createObject(cartObject)
      } else {
        const newCart = {
          orderItems: removeDuplicate(existOrder.orderItems, [orderItem._id]),
          finalPrice: Number(existOrder.finalPrice) + Number(orderProduct.finalPrice),
          priceWithOutTax: Number(existOrder.priceWithOutTax) + Number(orderProduct.priceWithOutTax),
          Tax: Number(existOrder.Tax) + Number(orderProduct.Tax)
        }

        const data = await this.update({ _id: existOrder._id }, newCart, true)
      }
      return existOrder
    } catch (error) {
      return { hasError: true, errorObject: error }
    }
  }

  async removeCart(req) {
    try {
      let existOrder = await this.findOneByCondition({ userId: req.user._id, statusCode: 0 })

      if (!existOrder) {
        const cartObject = {
          userId: req.user._id,
          statusCode: 0
        }
        existOrder = await this.createObject(cartObject)
      }
      return existOrder
    } catch (error) {
      return { hasError: true, errorObject: error }
    }
  }
})(CartModel)

/** @format */

const BaseService = require("../baseService")
const ConstantShipmentModel = require("../../model/v1/ConstantShipment")

module.exports = new (class ConstantShipmentService extends BaseService {
  async initialize() {
    try {
      const ShipmentTypes = [
        {
          name: "PICKUP",
          cost: 0,
          du_name: "Selbstabholung",
          freeAfterAmount: 0
        },
        {
          name: "SENDING_BY_COURIER",
          cost: 10,
          du_name: "VERSAND PER KURIER",
          freeAfterAmount: 200
        }
      ]
      return await Promise.all(
        ShipmentTypes.map(async (shipmentType) => {
          const thisshipmentType = await this.findOneByCondition({ name: shipmentType.name })
          if (!thisshipmentType) {
            return await this.createObject(shipmentType)
          }
          return await this.update({ name: shipmentType.name }, shipmentType, true)
        })
      )
    } catch (error) {
      return error
    }
  }
})(ConstantShipmentModel)

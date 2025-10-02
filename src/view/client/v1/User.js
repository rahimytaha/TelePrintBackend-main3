/** @format */

const BaseView = require("../../BaseView")
const { SECRET_KEY } = require("../../../config")
const jwt = require("jsonwebtoken")

module.exports = new (class CustomerView extends BaseView {
  transform(item, createToken) {
    return {
      id: item.id,
      phoneNumber: item.phoneNumber,
      email: item.email,
      customertype: item.customertype,
      firstName: item.firstName,
      lastName: item.lastName,
      postalCode: item.postalCode,
      country: item.country,
      address: item.address,
      city: item.city,
      gender: item.gender,
      company: item.company,
      industry: item.industry,
      UID_Nummer: item.UID_Nummer,
      Association: item.Association,
      AssociationNumber: item.AssociationNumber,
      chairman: item.chairman,
      ...this.withToken(item, createToken)
    }
  }
  withToken(item, createToken) {
    if (createToken) {
      const token = jwt.sign({ userId: item._id }, SECRET_KEY, {
        expiresIn: "10d"
      })
      return {
        token
      }
    } else {
      return {}
    }
  }
})()

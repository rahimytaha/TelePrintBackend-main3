/** @format */

const BaseView = require("../../BaseView");

module.exports = new (class View extends BaseView {
  transform(item) {
    return {
      id: item._id,
      orderIds: item.orderIds,
      invoiceNumber: "R-" + item.invoiceNumber,
      phoneNumber: item.phoneNumber,
      email: item.email,
      userId: item.userId,
      totalPayment: item.totalPayment,
      tax: item.tax,
      subTotal: item.subTotal,
      customertype: item.customertype,
      firstName: item.firstName,
      lastName: item.lastName,
      postalCode: item.postalCode,
      country: item.country,
      gender: item.gender,
      address: item.address,
      street: item.street,
      shipment: item.shipment,
      company: item.company,
      industry: item.industry,
      UID_Nummer: item.UID_Nummer,
      Association: item.Association,
      AssociationNumber: item.AssociationNumber,
      chairman: item.chairman,
    };
  }
})();

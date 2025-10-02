const BaseView = require("../../BaseView")
const { SECRET_KEY } = require("../../../config")
const jwt = require("jsonwebtoken")

module.exports = new (class AdminView extends BaseView {
  transform(item, createToken = false) {
    this.createToken = createToken
    return {
      id: item.id,
      firstName: item.firstName,
      lastName: item.lastName,
      userName: item.userName,
      password: item.password,
      isSuperUser: item.isSuperUser,

      ...this.withToken(item)
    }
  }

  withToken(item) {
    if (this.createToken) {
      let token = jwt.sign({ adminId: item.id }, SECRET_KEY, {
        expiresIn: "365d"
      })
      return { token }
    } else {
      return {}
    }
  }
})()

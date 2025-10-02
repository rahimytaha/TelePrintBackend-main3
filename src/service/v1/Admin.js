const BaseService = require("../baseService");
const AdminModel = require("../../model/v1/Admin");

module.exports = new (class AdminService extends BaseService {
  async createFirstAdminService(object) {
    const Admins = await this.findAll({ isSuperUser: true });

    if (Admins.length) {
      return false;
    } else {
      const firstAdmin = await this.createObject(object);
      return firstAdmin;
    }
  }
  async loginService(req) {
    const userNameExist = await this.findOneByCondition({
      userName: req.userName,
    });

    if (userNameExist) {
      // dev
       return { success: true, data: userNameExist };
      if (String(userNameExist.password) === String(req.password)) {
        return { success: true, data: userNameExist };
      } else {
        return { success: false, location: "password" };
      }
    } else {
      return { success: false, location: "userName" };
    }
  }
})(AdminModel);

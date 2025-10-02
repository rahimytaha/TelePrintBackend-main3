/** @format */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const AdminService = require("../service/v1/Admin");
const UserService = require("../service/v1/User");

async function AdminToken(req, res, next) {
  let token = await req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "توکن ارسال نشده",
    });
  }
  if (token.startsWith("Bearer")) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, async (err, decode) => {
      if (err) {
        return res.status(401).json({
          message: "توکن اشتباه است",
        });
      } else {
        const existAdmin = await AdminService.findOneByCondition({
          _id: decode.adminId,
        });
        if (existAdmin) {
          req.admin = existAdmin;
          next();
        } else {
          return res.status(401).json({
            message: "شما ادمین نیستید.",
          });
        }
      }
    });
  } else {
    return res.status(401).json({
      message: "توکن اشتباه است.",
    });
  }
}

async function UserToken(req, res, next) {
  let token = await req.headers.authorization;

  if (!token) {
    req.user = null;
    next();
  } else {
    token = token.slice(7, token.length);

    jwt.verify(token, SECRET_KEY, async (err, decode) => {
      if (err) {
        req.user = null;
      } else {
        const existUser = await UserService.findOneByCondition({
          _id: decode.userId,
        });

        if (existUser) {
          req.user = existUser;
        } else {
          req.user = null;
        }
      }
      next();
    });
  }
}

async function UserTokenRequire(req, res, next) {
  let token = await req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "توکن ارسال نشده",
    });
  }
  if (token.startsWith("Bearer")) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, SECRET_KEY, async (err, decode) => {
      if (err) {
        return res.status(401).json({
          message: "توکن اشتباه است",
        });
      } else {
        const existUser = await UserService.findOneByCondition({
          _id: decode.userId,
        });
        if (existUser) {
          req.user = existUser;
          next();
        } else {
          return res.status(401).json({
            message: "شما کاربر نیستید.",
          });
        }
      }
    });
  } else {
    return res.status(401).json({
      message: "توکن اشتباه است.",
    });
  }
}
module.exports = { UserToken, AdminToken, UserTokenRequire };

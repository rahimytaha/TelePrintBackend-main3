/** @format */

const BaseController = require("../../../BaseController")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
const SupportService = require("../../../../service/v1/Support")
const SupportView = require("../../../../view/client/v1/Support")
const { sendSupport } = require("../../../../util/nodeMailer")
const { paginationTools } = require("../../../../util")

const { GeneralFront } = require("../../../../log")
const { default: Axios } = require("axios")
const nextcloudUrl = 'https://cloud.teleprint.at/remote.php/dav/files/storageshare/Teleprint/Customers/';
const username = 'storageshare';
const password = '$SPyOME~PHdB8WM~';

module.exports = new (class SupportController extends BaseController {
  async createOrder(req, res) {
    try {

      const file = req.files;
      let link1 = undefined
      let link2 = undefined
      const createFolder = await fetch(nextcloudUrl + `${req.body.firstName} ${req.body.lastName}`, {
        method: 'MKCOL',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
          'Content-Length': 0,
        },
      })

      if (file.file1) {
        await fetch(`${nextcloudUrl}${req.body.firstName} ${req.body.lastName}/File1.${file.file1[0].originalname.split(".").pop()}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
          },
          body: file.file1[0].buffer,
        });


        const response2 = await Axios.post(`https://cloud.teleprint.at/ocs/v2.php/apps/files_sharing/api/v1/shares`,
          new URLSearchParams({
            path: `/Teleprint/Customers/${req.body.firstName} ${req.body.lastName}/File1.${file.file1[0].originalname.split(".").pop()}`,
            shareType: '3', // 3 = public link
            permissions: '1' // 1 = read-only
          }),
          {
            headers: {
              'OCS-APIRequest': 'true'
            },
            auth: {
              username: username,
              password: password

            }
          }
        );
        link1 = response2.data.ocs.data.url || undefined

      }
      if (file.file2) {
        const response = await fetch(`${nextcloudUrl}${req.body.firstName} ${req.body.lastName}/File2.${file.file2[0].originalname.split(".").pop()}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
          },
          body: file.file2[0].buffer,
        });
        const response2 = await Axios.post(`https://cloud.teleprint.at/ocs/v2.php/apps/files_sharing/api/v1/shares`,
          new URLSearchParams({
            path: `/Teleprint/Customers/${req.body.firstName} ${req.body.lastName}/File2.${file.file2[0].originalname.split(".").pop()}`,
            shareType: '3', // 3 = public link
            permissions: '1' // 1 = read-only
          }),
          {
            headers: {
              'OCS-APIRequest': 'true'
            },
            auth: {
              username: username,
              password: password

            }
          }
        );
        link2 = response2.data.ocs.data.url || undefined
      }




      const Object = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        product: req.body.product,
        description: req.body.description,
        count: req.body.count,
        file1: link1,
        file2: link2
      }
      const CreatedFlyerOrder = await SupportService.createObject(Object)

      if (!CreatedFlyerOrder) {
        res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
        return
      }

      sendSupport(CreatedFlyerOrder)
      return res.status(200).json({
        data: SupportView.transform(CreatedFlyerOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async cancellOrder(req, res) {
    try {
      const Object = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        description: req.body.description,
        orderId: req.body.orderId
      }
      const CreatedFlyerOrder = await SupportService.createObject(Object)

      if (!CreatedFlyerOrder) {
        res.status(400).json({
          data: "",
          message: "قابل ثبت نیست"
        })
        return
      }

      sendSupport(CreatedFlyerOrder)
      return res.status(200).json({
        data: SupportView.transform(CreatedFlyerOrder)
      })
    } catch (err) {
      GeneralFront.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getAllSearch(req, res) {
    try {
      const { page, limit, sort, condition } = req.body
      const newCondition = { email: req.user.email, ...condition }
      const skip = (page - 1) * limit
      const Carts = await SupportService.model
        .find(newCondition)
        .sort(sort ? sort : { createdAt: -1 })
        .limit(limit)
        .skip(skip)
      if (Carts && Carts.length) {
        return res.status(200).json({
          data: SupportView.transformCollection(Carts)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "وضعیت انباری ثبت نشده است."
        })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt",
        success: false
      })
    }
  }
  async getAllMetaData(req, res) {
    try {
      const { page, limit, sort, condition } = req.body
      const newCondition = { email: req.user.email, ...condition }

      const newProducts = await SupportService.model.find(newCondition).countDocuments()

      const metaData = paginationTools(newProducts, page, limit)

      return res.status(200).json({
        metaData: metaData
      })
    } catch (err) {
      return res.status(500).json({
        data: JSON.stringify(err),
        message: "Oops! Something went wrong."
      })
    }
  }
})()

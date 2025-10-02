const BaseController = require("../../../BaseController")
const ImageService = require("../../../../service/v1/Image")

const ImageView = require("../../../../view/client/v1/ImageView")
const { GeneralPanel } = require("../../../../log")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
module.exports = new (class ImageController extends BaseController {
  async getAllByParent(req, res) {
    try {
      const Images = await ImageService.findAll({
        tableId: req.params.parentId
      })

      if (Images && Images.length) {
        return res.status(200).json({
          data: ImageView.transformCollection(Images)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "عکسی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async create(req, res) {
    try {
      if (!req.files && !req.files.length) {
        return res.status(400).json({
          data: "",
          message: "هیچ فایلی آپلود نشده است"
        })
      }
      const Images = await Promise.all(
        await req.files.map(async (file) => {
          const createImage = await ImageService.createObject({
            url: BASE_URL_FOR_MULTER + "/gallery/" + file.filename
          })

          setTimeout(async () => {
            const checkImage = await ImageService.findOneByCondition({
              _id: createImage._id,
              tableId: null
            })
            if (checkImage) {
              await ImageService.removeImage(createImage.url)
              await ImageService.hardDelete({ id: createImage._id })
            }
          }, 1200000)
          return createImage
        })
      )
      if (Images) {
        return res.status(201).json({
          data: ImageView.transformCollection(Images),
          message: "عکس ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "عکس قابل ثبت نیست."
        })
      }
    } catch (err) {
      GeneralPanel.error(err)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

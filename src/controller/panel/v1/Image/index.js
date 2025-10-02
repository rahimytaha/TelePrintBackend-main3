/** @format */

const BaseController = require("../../../BaseController")
const ImageService = require("../../../../service/v1/Image")

const ImageView = require("../../../../view/panel/v1/ImageView")
const { GeneralPanel } = require("../../../../log")
const { BASE_URL_FOR_MULTER } = require("../../../../config")
module.exports = new (class ImageController extends BaseController {
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
            url: BASE_URL_FOR_MULTER + "/gallery/" + file.filename,
            tableName: req.body.tableName,
            tableId: req.body.tableId
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

  async getAll(req, res) {
    try {
      const Images = await ImageService.findAll({})

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

  async getAllUploaded(req, res) {
    try {
      const Images = await ImageService.findAll({ tableId: null })

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

  async getById(req, res) {
    try {
      const Image = await ImageService.findOneByCondition({
        _id: req.params.id
      })

      if (Image) {
        return res.status(200).json({
          data: ImageView.transform(Image)
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "آیدی اشتباه است"
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

  async deleteImage(req, res) {
    try {
      const deletedImage = await ImageService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedImage) {
        const deleteImage = await ImageView.transform(deletedImage)
        return res.status(200).json({
          data: deleteImage,
          message: "عکس مورد نظر حذف شد"
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "عکس یافت نشد"
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

  async updateImage(req, res) {
    try {
      await ImageService.handleImageArray(req.body.tableName, req.body.tableId, req.body.addImage, req.body.removeImage)
      const Images = await ImageService.findAll({
        tableName: req.body.tableName,
        tableId: req.body.tableId
      })

      if (Images && Images.length) {
        return res.status(200).json({
          data: ImageView.transformCollection(Images),
          message: "محصول ویرایش شد."
        })
      }
    } catch (error) {
      GeneralPanel.error(error)
      return res.status(500).json({
        data: error,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }
})()

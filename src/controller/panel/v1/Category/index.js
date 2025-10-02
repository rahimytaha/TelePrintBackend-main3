/** @format */

const BaseController = require("../../../BaseController")
const CategoryService = require("../../../../service/v1/Category")
const CategoryView = require("../../../../view/panel/v1/CategoryView")
const { GeneralPanel } = require("../../../../log")
const ImageService = require("../../../../service/v1/Image")

module.exports = new (class CategoryController extends BaseController {
  async create(req, res) {
    try {
      if (req.body.parentId) {
        const existParentId = await CategoryService.findOneByCondition({
          _id: req.body.parentId
        })
        if (!existParentId) {
          return res.status(400).json({
            data: "",
            message: "شناسه پدر اشتباه است"
          })
        }
      }

      const existCategoryId = await CategoryService.findOneByCondition({
        sort: req.body.sort
      })
      if (existCategoryId) {
        return res.status(400).json({
          data: "",
          message: "ترتیب تکراری وارد شده است."
        })
      }
      const object = {
        key: req.body.key,
        parentId: req.body.parentId,
        sort: req.body.sort
      }

      const create = await CategoryService.createObject(object)

      await ImageService.handleImageArray("Category", create._id, req.body.addImage, req.body.removeImage)

      const Images = await ImageService.findImage("Category", create._id)

      if (create) {
        return res.status(201).json({
          data: CategoryView.transform({ ...create._doc, Images: Images }),
          message: "منطقه ثبت شد."
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "منطقه قابل ثبت نیست."
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
      const Categorys = await CategoryService.findAllWithImage({}, "Category")
      if (Categorys && Categorys.length) {
        return res.status(200).json({
          data: CategoryView.transformCollection(Categorys)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "منطقهی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getTree(req, res) {
    try {
      const Categorys = await CategoryService.findAllRecursiveWithImage("parentId", "Category")

      if (Categorys && Categorys.length) {
        return res.status(200).json({
          data: CategoryView.transformCollection(Categorys)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "منطقهی ثبت نشده است."
        })
      }
    } catch (err) {
      GeneralPanel.error(error)

      return res.status(500).json({
        data: err,
        message: "Bitte prüfen Sie Ihr Benutzerkonto. Wenn alles korrekt ist, kontaktieren Sie uns per E-Mail oder Telefon. Sie erhalten 10 % Rabatt"
      })
    }
  }

  async getByParentId(req, res) {
    try {
      const Categorys = await CategoryService.findAllRecursivebyConditionWithImage(
        {
          parentId: req.params.parentId
        },
        "parentId",
        "Category"
      )

      if (Categorys && Categorys.length) {
        return res.status(200).json({
          data: CategoryView.transformCollection(Categorys)
        })
      } else {
        return res.status(204).json({
          data: [],
          message: "منطقهی ثبت نشده است."
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
      const Category = await CategoryService.findAllRecursivebyConditionWithImage(
        {
          _id: req.params.id
        },
        "parentId",
        "Category"
      )
      if (Category) {
        return res.status(200).json({
          data: CategoryView.transform(Category[0])
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "منطقه ی ثبت نشده است."
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

  async deleteCategory(req, res) {
    try {
      const deletedCategory = await CategoryService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedCategory) {
        const deleteCategory = await CategoryView.transform(deletedCategory)
        return res.status(200).json({
          data: deleteCategory,
          message: "منطقه مورد نظر حذف شد"
        })
      } else {
        return res.status(404).json({
          data: {},
          message: "منطقه یافت نشد"
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

  async updateCategory(req, res) {
    try {
      //! check send Id is true
      const existCategory = await CategoryService.findById(req.params.id)

      if (!existCategory) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }
      if (req.body.parentId) {
        const existParentId = await CategoryService.findOneByCondition({
          _id: req.body.parentId
        })
        if (!existParentId) {
          return res.status(400).json({
            data: "",
            message: "شناسه پدر اشتباه است"
          })
        }
      }
      const object = {
        key: req.body.key || existCategory.key,
        parentId: req.body.parentId || existCategory.parentId,
        sort: req.body.sort || existCategory.sort
      }

      const updateCategory = await CategoryService.update({ _id: req.params.id }, object, true)

      if (updateCategory) {
        return res.status(200).json({
          data: CategoryView.transform(updateCategory),
          message: "منطقه ویرایش شد."
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

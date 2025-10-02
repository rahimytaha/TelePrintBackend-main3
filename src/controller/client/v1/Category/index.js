const BaseController = require("../../../BaseController")
const CategoryService = require("../../../../service/v1/Category")
const CategoryView = require("../../../../view/client/v1/CategoryView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class CategoryController extends BaseController {
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
})()

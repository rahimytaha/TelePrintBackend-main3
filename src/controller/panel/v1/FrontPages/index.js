/** @format */

const BaseController = require("../../../BaseController")
const FrontPagesService = require("../../../../service/v1/FrontPages")
const FrontPagesView = require("../../../../view/panel/v1/FrontPagesView")
const { GeneralPanel } = require("../../../../log")

module.exports = new (class FrontPagesController extends BaseController {
  async pageList(req, res) {
    try {
      const productIds = [
        // WerbedrucksortenData
        "flyer",
        "folder-einfach-falz",
        "folder-wickelfalz-sechs-seitig",
        "folder-wickelfalz-acht-seitig",
        "folder-zfalz-sechs-seitig",
        "folder-zfalz-acht-seitig",
        "plakate",
        "laminierte-plakate",
        "plandruck",
        "stehkalender",
        "stofftaschen",
        "t-shirts",

        // BurodrucksortenData
        "briefe",
        "durchschreibeblöcke",
        "lose-blattsammlung",
        "personalisierte-briefe",
        "spiralbuch",
        "stempel",
        "visitenkarten",

        // BuchdruckData
        "buchdruck",
        "broschüren",
        "lesezeichen",
        "rückenbandbindung",
        "diplomarbeit",
        "softcover-bücher",

        // KlebebuchstabenData
        "etiketten",
        "klebebuchstaben",
        "klebefolien",
        "sticker",

        // FotodruckData
        "fotokalender",
        "fotoposter",
        "fototapeten",

        // WerbetechnikData
        "banner-transparente",
        "buttons",
        "eintrittskarten",
        "keilrahmen",
        "presspappe",
        "roll-ups",
        "schaumplatten",
        "tischkarten",
        // pages
        "anfrage",
        "login",
        "404",
        "blogs",
        "aboutUs",
        "cart",
        "contactUs",
        "dashboard",
        "datenschutzerklarung",
        "impressum",
        "produktionszeiten",
        "register",
        "reklamation",
        "selbstbedienung",
        "weitereLeistungen",
        // PackageData
        "41",
        "42",
        "43"
      ]

      return res.status(200).json({
        data: productIds
      })
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
      const existFrontPagesId = await FrontPagesService.findOneByCondition({
        key: req.body.key
      })
      if (existFrontPagesId) {
        return res.status(400).json({
          data: "",
          message: "This page already exists."
        })
      }
      const object = {
        key: req.body.key,
        metaTitle: req.body.metaTitle,
        metaDescription: req.body.metaDescription,
        metaKeywords: req.body.metaKeywords,
        content: req.body.content,
        canonicalUrl: req.body.canonicalUrl
      }

      const create = await FrontPagesService.createObject(object)

      if (create) {
        return res.status(201).json({
          data: FrontPagesView.transform(create)
        })
      } else {
        return res.status(400).json({
          data: {},
          message: "Die Seite konnte nicht erstellt werden."
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
      const FrontPagess = await FrontPagesService.findAll({})
      if (FrontPagess && FrontPagess.length) {
        return res.status(200).json({
          data: FrontPagesView.transformCollection(FrontPagess)
        })
      } else {
        return res.status(204).json({
          data: []
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

  async getById(req, res) {
    try {
      const FrontPages = await FrontPagesService.findOneByCondition({
        _id: req.params.id
      })
      if (FrontPages) {
        return res.status(200).json({
          data: FrontPagesView.transform(FrontPages)
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

  async deleteFrontPages(req, res) {
    try {
      const deletedFrontPages = await FrontPagesService.softDelete({ _id: req.params.id }, req.admin.userName)

      if (deletedFrontPages) {
        const deleteFrontPages = await FrontPagesView.transform(deletedFrontPages)
        return res.status(200).json({
          data: deleteFrontPages
        })
      } else {
        return res.status(404).json({
          data: {}
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

  async updateFrontPages(req, res) {
    try {
      //! check send Id is true
      const existFrontPages = await FrontPagesService.findById(req.params.id)

      if (!existFrontPages) {
        return res.status(400).json({
          data: "",
          message: "آیدی اشتباه است"
        })
      }

      const object = {
        key: req.body.key || existFrontPages.key,
        metaTitle: req.body.metaTitle || existFrontPages.metaTitle,
        metaDescription: req.body.metaDescription || existFrontPages.metaDescription,
        metaKeywords: req.body.metaKeywords || existFrontPages.metaKeywords,
        content: req.body.content || existFrontPages.content,
        canonicalUrl: req.body.canonicalUrl || existFrontPages.canonicalUrl
      }
      //test
      const updateFrontPages = await FrontPagesService.update({ _id: req.params.id }, object, true)

      if (updateFrontPages) {
        return res.status(200).json({
          data: FrontPagesView.transform(updateFrontPages)
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

const FieldOfSpecializationService = require("../../../../service/v1/FieldOfSpecialization");

module.exports = new (class EmailController {
  async create(req, res) {
    if (!req.body.id) {
      const existFieldOfSpecialization = await FieldOfSpecializationService.findOneByCondition({
        Fa: req.body.Fa,
        En: req.body.En,
        userId: req.user._id,
      });
      if (existFieldOfSpecialization) {
        res.status(400).json({
          data: "",
          message: "این زمینه قبلا ثبت شده",
        });
        return true;
      }

      const existFieldOfSpecializations = await FieldOfSpecializationService.findAll({
        userId: req.user._id,
      });
      if (existFieldOfSpecializations && existFieldOfSpecializations.length === 4) {
        res.status(400).json({
          data: "",
          message: "بیشتر از این نمی توانید زمینه تخصصی ثبت کنید",
        });
        return true;
      }
    }
  }
})();

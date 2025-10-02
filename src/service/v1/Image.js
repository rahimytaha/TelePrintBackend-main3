const BaseService = require("../baseService");
const ImageModel = require("../../model/v1/Image");
const ImageView = require("../../view/panel/v1/ImageView");
const path = require("path");
const fs = require("fs");

module.exports = new (class ImageService extends BaseService {
  async removeImage(url) {
    let name = url.split("/")[4];
    let picPath = path.join(__dirname, "..", "..", "..", "/gallery/", name);
    if (fs.existsSync(picPath)) {
      fs.unlinkSync(picPath);
    }
  }

  async handleImageArray(tableName, tableId, addImage, removeImage) {
    if (addImage && addImage.length) {
      Promise.all(
        await addImage.map(async (image) => {
          const checkImage = await this.findOneByCondition({
            _id: image,
            tableId: null,
          });
          if (checkImage) {
            const Updating = await this.update(
              { _id: image },
              { tableName: tableName, tableId: tableId }
            );
            console.log({ Updating: Updating });
          }
        })
      );
    }
    if (removeImage && removeImage.length) {
      Promise.all(
        await removeImage.map(async (image) => {
          const checkImage = await this.findOneByCondition({
            _id: image,
          });

          if (checkImage) {
            await this.removeImage(checkImage.url);
            await this.hardDelete({ id: checkImage._id });
          }
        })
      );
    }
  }

  async findImage(tableName, tableId) {
    const Images = await this.findAll({
      tableName: tableName,
      tableId: tableId,
    });
    if (Images && Images.length) {
      return Images;
    }
    return [];
  }
})(ImageModel);

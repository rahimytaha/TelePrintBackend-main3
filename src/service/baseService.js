/** @format */

const ImageModel = require("../model/v1/Image");

module.exports = class BaseService {
  constructor(model) {
    this.model = model;
  }

  //* findAll

  async findAll(condition) {
    return this.model.find({ ...condition, isDeleted: { $ne: true } });
  }

  async findAllWithImage(condition, tableName) {
    const dataWithOutImage = await this.model.find({
      ...condition,
      isDeleted: { $ne: true },
    });
    const dataWithImage = await Promise.all(
      await dataWithOutImage.map(async (item) => {
        const Images = await ImageModel.find({
          tableId: item._id,
          tableName: tableName,
        });

        return { ...item._doc, Images: Images };
      })
    );
    return dataWithImage;
  }

  async findAllRecursive(parentField) {
    const parent = await this.model.find({
      [parentField]: null,
      isDeleted: { $ne: true },
    });

    const getChildren = async (Parent) => {
      const data = await Promise.all(
        Parent.map(async (element) => {
          const children = await this.model.find({
            [parentField]: element._id,
            isDeleted: { $ne: true },
          });
          return {
            ...element._doc,
            child:
              children && children.length ? await getChildren(children) : [],
          };
        })
      );
      return data;
    };
    const result = await getChildren(parent);
    return result;
  }

  async findAllRecursivebyCondition(condition, parentField) {
    const parent = await this.model.find({
      ...condition,
      isDeleted: { $ne: true },
    });

    const getChildren = async (Parent) => {
      const data = await Promise.all(
        Parent.map(async (element) => {
          const children = await this.model.find({
            [parentField]: element._id,
            isDeleted: { $ne: true },
          });
          return {
            ...element._doc,
            child:
              children && children.length ? await getChildren(children) : [],
          };
        })
      );
      return data;
    };
    const result = await getChildren(parent);
    return result;
  }

  async findAllRecursiveWithImage(parentField, tableName) {
    const parent = await this.model
      .find({
        [parentField]: null,
        isDeleted: { $ne: true },
      })
      .sort("sort");

    const getChildren = async (Parent) => {
      const data = await Promise.all(
        Parent.map(async (element) => {
          const Images = await ImageModel.find({
            tableId: element._id,
            tableName: tableName,
          });
          const children = await this.model
            .find({
              [parentField]: element._id,
              isDeleted: { $ne: true },
            })
            .sort("sort");
          return {
            ...element._doc,
            child:
              children && children.length ? await getChildren(children) : [],
            Images: Images,
          };
        })
      );
      return data;
    };
    const result = await getChildren(parent);
    return result;
  }

  async findAllRecursivebyConditionWithImage(
    condition,
    parentField,
    tableName
  ) {
    const parent = await this.model.find({
      ...condition,
      isDeleted: { $ne: true },
    });

    const getChildren = async (Parent) => {
      const data = await Promise.all(
        Parent.map(async (element) => {
          const Images = await ImageModel.find({
            tableId: element._id,
            tableName: tableName,
          });
          const children = await this.model.find({
            [parentField]: element._id,
            isDeleted: { $ne: true },
          });
          return {
            ...element._doc,
            child:
              children && children.length ? await getChildren(children) : [],
            Images: Images,
          };
        })
      );
      return data;
    };
    const result = await getChildren(parent);
    return result;
  }

  async findAllDeleted() {
    return this.model.find({ isDeleted: true });
  }

  async findAllWithPagination(condition, { page, limit, sort }) {
    const data = await this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .sort(sort);
    const lastPage = Math.ceil(data.length / (limit || 10));
    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
    const startArray = ((page || 1) - 1) * (limit || 10);
    const newData = [...data].splice(startArray, limit || 10);
    const result = {
      data: newData,
      metaData: { pages, total: data.length, currentPage: page },
    };
    return result;
  }

  async findAllWithPaginationWithImage(
    condition,
    { page, limit, sort },
    tableName
  ) {
    const data = await this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .sort(sort);
    const lastPage = Math.ceil(data.length / (limit || 10));
    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
    const startArray = ((page || 1) - 1) * (limit || 10);
    const newDataWithOutImage = [...data].splice(startArray, limit || 10);
    const dataWithImage = await Promise.all(
      await newDataWithOutImage.map(async (item) => {
        const Images = await ImageModel.find({
          tableId: item._id,
          tableName: tableName,
        });

        return { ...item._doc, Images: Images };
      })
    );
    const result = {
      data: dataWithImage,
      metaData: { pages, total: data.length, currentPage: page },
    };
    return result;
  }

  async findAllAndPopulateWithPaginationAndImage(
    condition,
    { page, limit, sort },
    tableName,
    populate
  ) {
    const data = await this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .populate(populate)
      .sort(sort);
    const lastPage = Math.ceil(data.length / (limit || 10));
    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }
    const startArray = ((page || 1) - 1) * (limit || 10);
    const newDataWithOutImage = [...data].splice(startArray, limit || 10);
    const dataWithImage = await Promise.all(
      await newDataWithOutImage.map(async (item) => {
        const Images = await ImageModel.find({
          tableId: item._id,
          tableName: tableName,
        });

        return { ...item._doc, Images: Images };
      })
    );
    const result = {
      data: dataWithImage,
      metaData: { pages, total: data.length, currentPage: page },
    };
    return result;
  }

  async findAllAndPopulate(condition, name) {
    return this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .populate(name);
  }
  async findAllAndSort(condition, name) {
    return this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .sort(name);
  }

  async findAllAndPopulateImage(condition, tableName, populate) {
    const dataWithOutImage = await this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .populate(populate)
      .sort({ sort: 1 });

    const dataWithImage = await Promise.all(
      await dataWithOutImage.map(async (item) => {
        const Images = await ImageModel.find({
          tableId: item._id,
          tableName: tableName,
        });

        return { ...item._doc, Images: Images };
      })
    );
    return dataWithImage;
  }

  async findAllAndPopulateWithPagination(
    condition,
    name,
    { page, limit, sort }
  ) {
    const data = await this.model
      .find({ ...condition, isDeleted: { $ne: true } })
      .sort(sort)
      .populate(name);

    const lastPage = Math.ceil(data.length / (limit || 10));

    let pages = [];
    for (let i = 1; i <= lastPage; i++) {
      pages.push(i);
    }

    const startArray = ((page || 1) - 1) * (limit || 10);
    const newData = [...data].splice(startArray, limit || 10);
    const result = {
      data: newData,
      metaData: { pages, total: data.length, currentPage: page },
    };
    return result;
  }

  //* findOne
  async findById(id) {
    return await this.model.findById(id);
  }

  async findByIdPopulate(id, name) {
    return this.model.findById(id).populate(name);
  }

  async findOneByCondition(object) {
    const findObject = await this.model.findOne({
      ...object,
      isDeleted: { $ne: true },
    });
    return findObject;
  }

  async findOneByConditionBySort(object, sort) {
    const findObject = await this.model
      .findOne({
        ...object,
        isDeleted: { $ne: true },
      })
      .sort(sort);
    return findObject;
  }

  async findOneByConditionWithImage(object, tableName) {
    const findObject = await this.model.findOne({
      ...object,
      isDeleted: { $ne: true },
    });
    const Images = await ImageModel.find({
      tableId: findObject._id,
      tableName: tableName,
    });

    return { ...findObject._doc, Images: Images };
  }

  async findOneByConditionAndPopulate(object, name) {
    const findObject = await this.model
      .findOne({ ...object, isDeleted: { $ne: true } })
      .populate(name);
    return findObject;
  }

  async findOneByConditionAndPopulateWithImage(object, tableName, populate) {
    const findObject = await this.model
      .findOne({ ...object, isDeleted: { $ne: true } })
      .populate(populate);
    if (!findObject) {
      return;
    }
    const Images = await ImageModel.find({
      tableId: findObject._id,
      tableName: tableName,
    });
    return { ...findObject._doc, Images: Images };
  }

  //* delete

  async hardDelete(condition) {
    const deletedObject = await this.model.findOneAndRemove(condition);
    return deletedObject;
  }

  async softDelete(condition, user) {
    const deletedObject = await this.model.findOneAndUpdate(
      condition,
      {
        isDeleted: true,
        deletedBy: user,
      },
      {
        new: true,
      }
    );
    return deletedObject;
  }

  async hardDeleteMany(condition) {
    return this.model.deleteMany(condition);
  }

  //* UpdateOne
  async update(condition, object, returnNew) {
    const updateObject = await this.model.findOneAndUpdate(condition, object, {
      new: returnNew,
    });
    return updateObject;
  }

  async updateBySoftDelete(condition, object, req) {
    await this.model.findOneAndUpdate(condition, {
      isDeleted: true,
      deletedBy: req.admin.userName,
    });
    return await this.createObject(object);
  }

  //* UpdateAll

  async updateAll(condition, object, returnNew) {
    const updateObject = await this.model.updateMany(condition, object, {
      new: returnNew,
    });
    return updateObject;
  }

  async restoreSoftDelete(condition) {
    const deletedObject = await this.model.findOneAndUpdate(
      condition,
      {
        isDeleted: false,
        deletedBy: "",
      },
      {
        new: true,
      }
    );
    return deletedObject;
  }
  //* create

  async createObject(object) {
    const createdObject = await new this.model(object);
    const result = await createdObject.save();
    return result;
  }
};

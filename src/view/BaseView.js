module.exports = class BaseView {
  transformCollection(items, something, somethingElse) {
    return items.map((item) => this.transform(item, something, somethingElse));
  }
};

// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
});
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  onDelete: 'SET NULL',
});
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'tagId',
});
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tagId',
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};

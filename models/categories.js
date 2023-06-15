'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class categories extends Model {
    static associate(models) {
      // define association here
      categories.hasMany(models.posts, { foreignKey: 'categoriesId' });
    }
  }
  categories.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    desc: {
      allowNull: false,
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'categories',
  });
  return categories;
};
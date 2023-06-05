'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class forums extends Model {
    static associate(models) {
      forums.hasMany(models.posts, { foreignKey: 'forumsId' });
    }
  } 
  forums.init({
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
    modelName: 'forums',
  });
  return forums;
};
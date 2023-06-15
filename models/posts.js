'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class posts extends Model {
    static associate(models) {
      posts.belongsTo(models.forums, { foreignKey: 'forumsId' });
      posts.belongsTo(models.categories, { foreignKey: 'categoriesId' });
      posts.belongsTo(models.users, { foreignKey: 'userId' });
      posts.hasMany(models.comments, {foreignKey: 'postId'});
    }
  }
  posts.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      allowNull: false,
      type: DataTypes.STRING
    },
    content: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    forumsId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'forums',
        key: 'id'
      }
    },
    categoriesId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'categories',
        key: 'id'
      }
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'posts',
  });
  return posts;
};
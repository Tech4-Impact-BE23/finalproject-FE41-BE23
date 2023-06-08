'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class comments extends Model {
    static associate(models) {
      // define association here
      comments.belongsTo(models.posts, { foreignKey: 'postId' });
      comments.belongsTo(models.users, { foreignKey: 'userId' });
    }
  }
  comments.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    content: {
      type: DataTypes.TEXT
    },
    postId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'posts',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'comments',
  });
  return comments;
};
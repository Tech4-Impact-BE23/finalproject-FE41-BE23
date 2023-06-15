'use strict';
const { Model, DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  class commentsReaction extends Model {
    static associate(models) {
      // define association here
      commentsReaction.belongsTo(models.comments, { foreignKey: 'commentsId' });
      commentsReaction.belongsTo(models.users, { foreignKey: 'userId' });
    }
  }
  commentsReaction.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.ENUM('like', 'dislike'),
      allowNull: false,
    },
    commentId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'comments',
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
    modelName: 'commentsReaction',
  });
  return commentsReaction;
};
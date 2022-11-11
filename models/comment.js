const { Model, DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("../config/connection");

class Comment extends Model {}

Comment.init(
  {
    posterId: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.STRING,
    },
    blogNum: {
      type: Sequelize.INTEGER,
    },
  },
  {
    sequelize,
  }
);

module.exports = Comment;

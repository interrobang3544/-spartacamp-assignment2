'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Post.belongsTo(models.User, {foreignKey: "userId"})
      models.Post.hasMany(models.Comment, {foreignKey: "postId"})
      models.Post.belongsToMany(models.User, { through: "Like", as: "Liker", foreignKey: "postId", otherKey: 'userId' })
    }
  }
  Post.init({
    postId: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    likes: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
const BlogPost = require('./BlogPost');
const User = require("./User");
const Comment = require ("./Comment");

User.hasMany(BlogPost, {foreignKey: "user_id"})
User.hasMany(Comment, {foreignKey: "user_id"});
BlogPost.hasMany(Comment, {foreignKey: "post_id"});

module.exports = {
  BlogPost,
  User,
  Comment
}
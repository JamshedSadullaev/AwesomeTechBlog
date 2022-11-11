const User = require("./user");
const Blog = require("./blog");
const Comment = require("./comment");

User.hasMany(Blog);
Blog.belongsTo(User);

Blog.hasMany(Comment);
Comment.belongsTo(Blog);

module.exports = { Blog, User, Comment };

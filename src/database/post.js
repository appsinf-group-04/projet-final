const PostModel = require("../models/post");

async function createPost(title, price, state, description, userID) {
  const post = new PostModel({
    title: title,
    price: price,
    state: state,
    description: description,
    refUser: userID,
  });

  await post.save();

  return post;
}

async function getPosts(limit) {
  const posts = await PostModel
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("refUser")
    .exec();

  return posts;
}

async function getPost(postID) {
  const post = await PostModel
    .findById(postID)
    .populate("refUser")
    .exec();

  return post;
}

module.exports = {
  createPost,
  getPosts,
  getPost,
};

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
  const posts = await PostModel.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("refUser")
    .exec();

  posts.map((p) => {
    switch (p.state) {
      case "great":
        p.state = "Très bon";
        break;
      case "good":
        p.state = "Bon";
        break;
      case "ok":
        p.state = "Ok";
        break;
      case "used":
        p.state = "Usé";
        break;
    }
  });

  posts.filter((p) => {
    return p.ban.banned === false;
  });

  return posts;
}

async function getPost(postID) {
  const post = await PostModel.findById(postID).populate("refUser").exec();

  switch (post.state) {
    case "great":
      post.state = "Très bon";
      break;
    case "good":
      post.state = "Bon";
      break;
    case "ok":
      post.state = "Ok";
      break;
    case "used":
      post.state = "Usé";
      break;
  }

  return post;
}

async function getPostForUser(userID) {
  const posts = await PostModel.find({ refUser: userID }).sort({
    createdAt: -1,
  });
  return posts;
}

async function setPictures(postID, pictures) {
  const post = await PostModel.findById(postID);

  post.pictures = pictures;

  await post.save();
}

async function deletePost(postID) {
  try {
    await PostModel.findByIdAndDelete(postID);
  } catch (error) {
    console.log("error deleting post");
  }
}

module.exports = {
  createPost,
  getPosts,
  getPost,
  setPictures,
  getPostForUser,
  deletePost,
};

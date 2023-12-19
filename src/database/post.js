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

  return posts;
}

async function getPost(postID) {
  const post = await PostModel
    .findById(postID)
    .populate("refUser")
    .exec();

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

module.exports = {
  createPost,
  getPosts,
  getPost,
};

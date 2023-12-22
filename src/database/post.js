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
  let posts = await PostModel.find({})
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

  posts = posts.filter((p) => {
    if (p.ban && p.ban.banned === true) {
      return false;
    }
    if (p.sold === true) {
      return false;
    }
    return true;
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
  let posts = await PostModel.find({ refUser: userID }).sort({
    createdAt: -1,
  });

  posts = posts.filter((p) => {
    if (p.ban && p.ban.banned === true) {
      return false;
    }
    if (p.sold === true) {
      return false;
    }
    return true;
  });

  return posts;
}

async function setPictures(postID, pictures) {
  const post = await PostModel.findById(postID);

  post.pictures = pictures;

  await post.save();
}

async function deletePost(postID) {
  await PostModel.findByIdAndDelete(postID);
}

async function getPostById(postId) {
  const post = await PostModel.findById(postId);

  return post;
}

async function markPostSold(postId) {
  const post = await PostModel.findById(postId);

  post.sold = true;
  await post.save();
}

async function searchPosts(query, maxPrice, sellerRank) {
  let posts = [];

  if (!maxPrice) {
    console.log("no max price");
    posts = await PostModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { "refUser.name": { $regex: query, $options: "i" } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("refUser")
      .exec();
  } else {
    posts = await PostModel.find({
      $and: [
        { price: { $lte: maxPrice } },
        {
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { "refUser.name": { $regex: query, $options: "i" } },
          ],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("refUser")
      .exec();
  }

  let filteredPosts = posts.filter((p) => {
    if (p.ban && p.ban.banned === true) {
      return false;
    }
    if (p.sold === true) {
      return false;
    }
    return true;
  });

  if (sellerRank) {
    filteredPosts = filteredPosts.filter((p) => {
      const ranking =
        p.refUser.ranking.reduce((a, b) => a + b, 0) / p.refUser.ranking.length;

      return ranking >= sellerRank;
    });
  }

  filteredPosts.map((p) => {
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

  return filteredPosts;
}

module.exports = {
  createPost,
  getPosts,
  getPost,
  setPictures,
  getPostForUser,
  deletePost,
  getPostById,
  markPostSold,
  searchPosts,
};

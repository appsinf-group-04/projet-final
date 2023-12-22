const UserModel = require("../models/user");
const PostModel = require("../models/post");
const {
  createPost,
  setPictures,
  getPost,
  deletePost,
} = require("../database/post");

/**
 * @param {string} email The seller's email
 * @param {string} value The note value
 *
 * @returns {Promise<number>} The user's average notes
 */
async function addRank(postID, value, userID) {
  const post = await getPost(postID);
  const userToRank = await UserModel.findOne({ email: post.refUser.email });

  userToRank.ranking.push(value);
  post.interested.push(userID);

  await userToRank.save();
  await post.save();

  return (
    userToRank.ranking.reduce((a, b) => a + b, 0) / userToRank.ranking.length
  );
}

async function getAverageRanking(email) {
  const user = await UserModel.findOne({ email: email });

  const ranking = user.ranking.reduce((a, b) => a + b, 0) / user.ranking.length;

  if (Number.isNaN(ranking)) {
    return 0;
  }

  return ranking;
}

/**
 * [ADMIN] Reset the ranking of a seller
 * @param {string} email The seller's email
 */
async function resetRanking(email) {
  const user = await UserModel.findOne({ email: email });
  user.ranking = [];
  await user.save();
}

async function hasAlreadyGivenRank(userID, postID) {
  const post = await getPost(postID);

  // cannot rank yourself
  if (post.refUser.id === userID) {
    return true;
  }

  try {
    for (i = 0; i < post.interested.length; i++) {
      if (userID === post.interested[i].toString()) {
        return true;
      }
    }
  } catch (error) {
    console.log("error occured while checking ranks");
  }
  return false;
}

module.exports = {
  addRank,
  getAverageRanking,
  resetRanking,
  hasAlreadyGivenRank,
};

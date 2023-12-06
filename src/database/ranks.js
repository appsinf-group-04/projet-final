const UserModel = require("../models/user");

/**
 * @param {string} email The seller's email
 * @param {string} value The note value
 *
 * @returns {Promise<number>} The user's average notes
 */
async function addRank(email, value) {
  const user = await UserModel.findOne({ email: email });

  user.ranking.push(value);

  await user.save();

  return user.ranking.reduce((a, b) => a + b, 0) / user.ranking.length;
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

module.exports = { addRank, getAverageRanking, resetRanking };

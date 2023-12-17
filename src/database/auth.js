const crypto = require("crypto");

const UserModel = require("../models/user");
const PostModel = require("../models/post");
const { logNewLogin } = require("./logins");
const { formatDate } = require("../utils/utils");

async function getUserByEmail(email) {
  const user = UserModel.findOne({ email: email });

  return user;
}

async function createUser(email, password, phone, name, profilePicture) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const passwordHash = hash.digest("hex");

  const user = new UserModel({
    email: email,
    name: name,
    password: passwordHash,
    phone: phone,
    profilePicture: profilePicture,
  });

  await user.save();

  return user;
}

async function testPassword(email, password) {
  const hash = crypto.createHash("sha256");
  hash.update(password);
  const passwordHash = hash.digest("hex");

  const user = await UserModel.findOne({ email: email });

  if (user.password === passwordHash) {
    return true;
  }

  return false;
}

async function banUser(email, reason) {
  const user = await UserModel.findOne({ email: email });

  user.ban = {
    reason: reason,
    at: Date.now(),
    banned: true,
  };

  await user.save();
}

async function unbanUser(email) {
  const user = await UserModel.findOne({ email: email });

  user.ban.banned = false;

  await user.save();
}

async function isUserBanned(email) {
  const user = await UserModel.findOne({ email: email });

  return user.ban.banned;
}

async function getLatestBannedUsers(amount) {
  const users = await UserModel.find({ "ban.banned": true })
    .sort({ "ban.at": -1 })
    .limit(amount);
  return users;
}

async function searchBannedUsers(query) {
  const users = await UserModel.find({
    $or: [
      { email: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } },
      { "ban.reason": { $regex: query, $options: "i" } },
    ],
    $and: [{ "ban.banned": true }],
  });

  return users;
}

async function logLogin(email) {
  const now = new Date();
  const nowFormatted = formatDate(now);

  const user = await UserModel.findOne({ email: email });
  const lastLogin = user.lastLogin;
  const lastLoginFormatted = formatDate(lastLogin);

  user.lastLogin = now;

  await user.save();

  if (lastLoginFormatted !== nowFormatted) {
    await logNewLogin();
  }
}

module.exports = {
  createUser,
  getUserByEmail,
  testPassword,
  banUser,
  unbanUser,
  isUserBanned,
  getLatestBannedUsers,
  searchBannedUsers,
  logLogin,
};

const crypto = require("crypto");

const UserModel = require("../models/user");

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

module.exports = {
  createUser,
  getUserByEmail,
  testPassword,
  banUser,
  unbanUser,
  isUserBanned,
};
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

// return and add a post to the db
async function createPost(title, price, state, description, userID, userName) {
  const post = new PostModel({
    title: title,
    price: price,
    state: state,
    description: description,
    refUser: userID,
    seller: userName,
    ban: {
      reason: '',
      at: new Date(),
      banned: false
    },
  });

  await post.save();

  return post;
}

function getMean(lst) {
  if (lst.length == 0) {return 0;}
  let mean = 0;
  for(i = 0; i < lst.length; i++) {
    mean += lst[i];
  }
  return mean / lst.length;
}

// get the posts with the according seller's informations to display on main page
async function getAllPosts(){
  const postsFromDB = await PostModel.find();
  let postsResult = [];
  
  for(i = 0; i < postsFromDB.length; i++) {
    let seller = await UserModel.findById(postsFromDB[i].refUser)  
    let post = {
      title: postsFromDB[i].title,
      price: postsFromDB[i].price,
      state: postsFromDB[i].state,
      seller: seller.name,
      sellerRating: getMean(seller.ranking)
    }
    postsResult.push(post);
  }
  return postsResult;
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
  createPost,
  getAllPosts,
  getUserByEmail,
  testPassword,
  banUser,
  unbanUser,
  isUserBanned,
  getLatestBannedUsers,
  searchBannedUsers,
  logLogin,
};

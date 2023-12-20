const UserModel = require("../models/user");
const PostModel = require("../models/post");
const { logNewLogin } = require("../database/logins");

async function unpopulateUserDB(fakeUsers) {
  for (const email of fakeUsers) {
    await UserModel.deleteOne({ email: email });
  }
}

async function populateUserDB(amountToFake) {
  const fakers = [];
  for (let i = 0; i < amountToFake; i++) {
    const isBanned = Math.random();
    const randomDay = Math.floor(Math.random() * 20);
    const createdAt = new Date(Date.now() - randomDay * 864e5);

    await logNewLogin(createdAt);

    const user = {
      email: `fakeuser${i}@uclouvain.be`,
      password: `fakeuser${i}`,
      name: `FakeUser${i}`,
      phone: "0499999999",
      createdAt: createdAt,
    };

    if (isBanned > 0.7) {
      user.ban = {
        reason: "Test",
        at: new Date(Date.now() - randomDay * 864e5),
        banned: true,
      };
    }

    await new UserModel(user).save();
    fakers.push(user.email);
  }

  return fakers;
}

async function populatePostsDB(amountToFake, userId) {
  const fakers = [];

  for (let i = 0; i < amountToFake; i++) {
    const randomDay = Math.floor(Math.random() * 20);
    const createdAt = new Date(Date.now() - randomDay * 864e5);
    const sold = Math.random();

    const post = new PostModel({
      title: `Fake Post ${i}`,
      price: Math.floor(Math.random() * 1000),
      state: "new",
      description: "This is a fake post",
      createdAt: createdAt,
      refUser: userId,
      sold: sold > 0.5,
    });

    await post.save();

    fakers.push(post._id);
  }

  return fakers;
}

async function unpopulatePostsDB(fakePosts) {
  for (const postId of fakePosts) {
    await PostModel.findByIdAndDelete(postId);
  }
}

module.exports = {
  populateUserDB,
  unpopulateUserDB,
  populatePostsDB,
  unpopulatePostsDB,
};

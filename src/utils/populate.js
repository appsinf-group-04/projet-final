const UserModel = require("../models/user");
const { logNewLogin } = require("../database/logins");
const { formatDate } = require("./utils");

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

module.exports = {
  populateUserDB,
  unpopulateUserDB,
  reallyPopulateUserDB: populateUserDB,
};

const mongoose = require("mongoose");

const UserModel = require("../src/models/user");
const { createUser } = require("../src/database/auth");
const { addRank, getAverageRanking, resetRanking } = require("../src/database/ranks");

describe("Ranking", () => {

  let user;

  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/projet-final")
      .catch((err) => console.log(err));

    const email = "jocke@uclouvain.be";
    user = await createUser(
      email,
      "passwordsecure",
      "0470626544",
      "Jocke",
    );
  });

  afterAll(async () => {
    await UserModel.deleteOne({ email: user.email });
    await mongoose.connection.close();
  });

  test("Ranking should be 0 by default", async () => {
    const avg = await getAverageRanking(user.email);
    expect(avg).toBe(0);
  });

  test("Should add a ranking", async () => {
    await addRank(user.email, 4);
    const avg = await getAverageRanking(user.email);
    expect(avg).toBe(4);
  });

  test("Should add a ranking and eval correct avg", async () => {
    await addRank(user.email, 2);
    const avg = await getAverageRanking(user.email);
    expect(avg).toBe(3);
  });

  test("Should reset ranking", async () => {
    await resetRanking(user.email);

    const avg = await getAverageRanking(user.email);
    expect(avg).toBe(0);
  });
});

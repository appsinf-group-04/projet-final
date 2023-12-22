const mongoose = require("mongoose");

const UserModel = require("../src/models/user");
const PostModel = require("../src/models/post");
const { createUser } = require("../src/database/auth");
const { createPost,
  getPosts,
  getPost,
  getPostForUser,
  deletePost,
  getPostById,
  markPostSold 
} = require("../src/database/post");
const { addRank, getAverageRanking, resetRanking } = require("../src/database/ranks");

describe("Ranking", () => {

  let user;
  let post;

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
    post = await createPost(
      "title", 
      12, 
      "good", 
      "small description", 
      user._id
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
    await addRank(post.id, 4, "657f1ad88b24e96d12fa4494");
    const avg = await getAverageRanking(user.email);
    expect(avg).toBe(4);
  });

  test("Should add a ranking and eval correct avg", async () => {
    await addRank(post.id, 2, "657f1ad88b24e96d12fa4495");
    const avg = await getAverageRanking(user.email);
    expect(avg).toBe(3);
  });

  test("Should reset ranking", async () => {
    await resetRanking(user.email);

    const avg = await getAverageRanking(user.email);
    expect(avg).toBe(0);
  });
});
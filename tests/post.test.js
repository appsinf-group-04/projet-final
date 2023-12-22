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

describe("Posts", () => {

  let user;
  let initialPosts;
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

    initialPosts = await getPosts(50);

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

  test("getPosts's length should be incremented", async () => {
    const posts = await getPosts(20);
    expect(posts.length).toBe(initialPosts.length + 1);
  });

  test("A new post with correct values should be created", async () => {
    const newPost = await getPost(post._id);
    expect(newPost.title).toBe("title");
    expect(newPost.price).toBe(12);
  });

  test("New user created 1 post only", async () => {
    const posts = await getPostForUser(user._id);
    expect(posts.length).toBe(1);
  });

  test("A new post should be accessible by its id", async () => {
    const newPost = await getPostById(post._id);
    expect(newPost.title).toBe("title");
    expect(newPost.price).toBe(12);
    expect(newPost._id.toString()).toBe(post._id.toString());
  });

  test("Should mark the new post as sold", async () => {
    const newPost = await getPost(post.id);
    expect(newPost.sold).toBe(false);
    await markPostSold(newPost.id);
    const newPostSold = await getPost(newPost.id);
    expect(newPostSold.sold).toBe(true);
  });

  test("Should delete the new post", async () => {
    await deletePost(post.id);
    const posts = await getPosts(20);
    expect(posts.length).toBe(initialPosts.length);
  });
});
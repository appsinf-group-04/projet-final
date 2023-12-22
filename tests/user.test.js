const mongoose = require("mongoose");
const {
  createUser,
  getUserByEmail,
  testPassword,
  banUser,
  unbanUser,
  isUserBanned,
  getLatestBannedUsers,
  searchBannedUsers,
  logLogin,
} = require("../src/database/auth");
const UserModel = require("../src/models/user");

describe("User", () => {

  let user;
  let initialLength;

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

  describe("getUserByEmail", () => {
    test("should get user by email", async () => {
      const fetchedUser = await getUserByEmail("jocke@uclouvain.be");

      expect(fetchedUser).toBeDefined();
      expect(fetchedUser.email).toBe("jocke@uclouvain.be");
    });
  });

  describe("testPassword", () => {
    test("should test a correct password", async () => {
      const isPasswordCorrect = await testPassword(
        "jocke@uclouvain.be",
        "passwordsecure"
      );

      expect(isPasswordCorrect).toBe(true);
    });

    test("should test an incorrect password", async () => {
      const isPasswordCorrect = await testPassword(
        "jocke@uclouvain.be",
        "incorrectpassword"
      );

      expect(isPasswordCorrect).toBe(false);
    });
  });

  describe("banUser and isUserBanned", () => {
    test("should ban a user and check if the user is banned", async () => {
      await banUser("jocke@uclouvain.be", "Violation of terms");

      const isBanned = await isUserBanned("jocke@uclouvain.be");

      expect(isBanned).toBe(true);
    });
  });

  describe("unbanUser", () => {
    test("should unban a user", async () => {
      await unbanUser("jocke@uclouvain.be");

      const isBanned = await isUserBanned("jocke@uclouvain.be");

      expect(isBanned).toBe(false);
    });
  });

  describe("getLatestBannedUsers", () => {
    test("should get the latest banned users", async () => {
      // Assuming there is at least one banned user in the database
      await banUser(user.email, "Violation of terms");

      const users = await getLatestBannedUsers(1);

      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(user.email);
    });

    test("should return an empty array when no users are banned", async () => {
      // Ensure no user is banned for this test case
      await UserModel.updateMany({}, { $unset: { ban: 1 } });

      const latestBannedUsers = await getLatestBannedUsers(1);

      expect(latestBannedUsers).toHaveLength(0);
    });
  });

    describe("searchBannedUsers", () => { 
    test("should search for banned users", async () => {

        await banUser(user.email, "Violation of terms");
    
        const users = await searchBannedUsers("abcdedf");

        expect(users.length).toBe(0);

        const users2 = await searchBannedUsers(user.email);

        expect(users2.length).toBeGreaterThan(0);
    });
  });

  describe("logLogin", () => {
    test("should log a new login", async () => {
      await logLogin("jocke@uclouvain.be");

      const updatedUser = await UserModel.findOne({
        email: "jocke@uclouvain.be",
      });

      expect(updatedUser).toBeDefined();
      expect(updatedUser.lastLogin).not.toBeNull();
    });
  });
});

const router = require("express").Router();
const authRouter = require("./auth");
const postRouter = require("./post");

// middlewares and functions import
const authMiddleware = require("../middlewares/auth");
const {
  getAccountsCreatedByDay,
  getBansOverTime,
  getAccountsOverTime,
  getPostsCreatedByDay,
} = require("../database/stats");
const { getPosts, getPostForUser } = require("../database/post");

const { getLatestBannedUsers, searchBannedUsers } = require("../database/auth");
const { formatDate } = require("../utils/utils");
const { getLoginsPerDay: getLoginsByDay } = require("../database/logins");

router.use("/auth", authRouter);
router.use("/posts", postRouter);

// Index page route
router.get("/", async (req, res) => {
  const user = req.session.user;
  const posts = await getPosts(20);

  res.render("pages/index", { user, posts });
});

// Profile page route
router.get("/profile", authMiddleware.userAuth, async (req, res) => {
  const user = req.session.user;
  const posts = await getPostForUser(user.id);
  res.render("pages/profile", { user, posts });
});

// Admin dashboard page
router.get("/dash", authMiddleware.adminAuth, async (req, res) => {
  const query = req.query.q;

  const accountsByDay = await getAccountsCreatedByDay();
  const bansOverTime = await getBansOverTime();
  const accountsOverTime = await getAccountsOverTime();
  const loginsByDay = await getLoginsByDay();
  const postsByDay = await getPostsCreatedByDay();

  let bans = [];
  if (query) {
    bans = await searchBannedUsers(query);
  } else {
    bans = await getLatestBannedUsers(10);
  }

  bans = bans.map((user) => {
    return {
      name: user.name,
      email: user.email,
      createdAt: formatDate(user.createdAt),
      lastLogin: formatDate(user.lastLogin),
      ranking: user.ranking,
      ban: {
        reason: user.ban.reason,
        at: formatDate(user.ban.at),
        banned: user.ban.banned,
      },
    };
  });

  res.render("pages/dashboard", {
    accountsByDay,
    bansOverTime,
    accountsOverTime,
    bans,
    query,
    loginsByDay,
    postsByDay,
    user: req.session.user,
  });
});

router.get("/*", (req, res) => {
  res.render("pages/404", { user: req.session.user });
});

module.exports = router;

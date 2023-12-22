const router = require("express").Router();
const authRouter = require("./auth");
const postRouter = require("./post");
const authMiddleware = require("../middlewares/auth");
const {
  getAccountsCreatedByDay,
  getBansOverTime,
  getAccountsOverTime,
  getPostsCreatedByDay,
  getPostsOverTime,
} = require("../database/stats");

const { getPosts, getPostForUser } = require("../database/post");

const { getLatestBannedUsers, searchBannedUsers } = require("../database/auth");
const { formatDate } = require("../utils/utils");
const { getLoginsPerDay: getLoginsByDay } = require("../database/logins");

router.use("/auth", authRouter);
router.use("/", postRouter);

// Index page
router.get("/", async (req, res) => {
  const user = req.session.user;
  const listOfCourses = ["LINFO1212", "LMATH1002", "LCOPS1204"];
  const posts = await getPosts(20);

  res.render("pages/index", { user, posts, listOfCourses });
});

// Profile page
router.get("/profile", authMiddleware.userAuth, async (req, res) => {
  const user = req.session.user;
  const posts = await getPostForUser(user.id);
  res.render("pages/profile", { user, posts });
});

router.get("/profile/create", (req, res) => {
  const user = req.session.user;
  res.render("pages/create", { user });
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

router.use((req, res) => {
  res.status(404).render("pages/404", { user: req.session.user });
});

// example of middleware usage, this route is protected and cannot be accessed without being logged in
router.get("/xxx", authMiddleware.userAuth);
router.get("/xxx", authMiddleware.adminAuth);

// you can even chain them
router.get("/xxx", authMiddleware.userAuth, authMiddleware.adminAuth);

module.exports = router;

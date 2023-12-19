const router = require("express").Router();
const authRouter = require("./auth");
const authMiddleware = require("../middlewares/auth");
const {
  getAccountsCreatedByDay,
  getBansOverTime,
  getAccountsOverTime,
  getPostsCreatedByDay,
  getPostsOverTime,
} = require("../database/stats");
const { getLatestBannedUsers, searchBannedUsers } = require("../database/auth");
const { formatDate } = require("../utils/utils");
const { getLoginsPerDay: getLoginsByDay } = require("../database/logins");

router.use("/auth", authRouter);

router.get("/", (req, res) => {
  const user = req.session.user;
  const annonces = [
    {
      seller: "Jean Mahmoud",
      sellerRating: 2.11,
      objectName: "Livre de math",
      price: 11,
      state: "Nul à chier",
    },
    {
      seller: "Abdul Kader",
      sellerRating: 4,
      objectName: "Livre d'anglais",
      price: 40,
      state: "Très bon",
    },
  ];

  const listOfCourses = ["LINFO1212", "LMATH1002", "LCOPS1204"];

  res.render("pages/index", { user, annonces, listOfCourses });
});

router.get("/profile", (req, res) => {
  const user = req.session.user;
  const annonces = [
    {
      img: "/public/images/book_placeholder.png",
      seller: "Jean Mahmoud",
      objectName: "Livre de math",
      price: 11,
      state: "Nul à chier",
    },
    {
      img: "/public/images/book_placeholder.png",
      seller: "Abdul Kader",
      objectName: "Livre d'anglais",
      price: 40,
      state: "Très bon",
    },
    {
      img: "/public/images/book_placeholder.png",
      seller: "Max Günter",
      objectName: "Livre d'allemand",
      price: 35,
      state: "Bon",
    },
    {
      img: "/public/images/book_placeholder.png",
      seller: "Olaf Müller",
      objectName: "Livre d'histoire",
      price: 65,
      state: "Très bon",
    },
  ];

  res.render("pages/profile", { user, annonces });
});

router.get("/details", (req, res) => {
  const user = req.session.user;
  res.render("pages/details", { user });
});

router.get("/profile/create", (req, res) => {
  const user = req.session.user;
  res.render("pages/create", { user });
});

router.get("/dash", async (req, res) => {
  const query = req.query.q;

  const accountsByDay = await getAccountsCreatedByDay();
  const bansOverTime = await getBansOverTime();
  const accountsOverTime = await getAccountsOverTime();
  const loginsByDay = await getLoginsByDay();
  const postsByDay = await getPostsCreatedByDay();
  const postsOverTime = await getPostsOverTime();

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
    postsOverTime,
    user: req.session.user,
  });
});

// example of middleware usage, this route is protected and cannot be accessed without being logged in
router.get("/xxx", authMiddleware.userAuth);
router.get("/xxx", authMiddleware.adminAuth);

// you can even chain them
router.get("/xxx", authMiddleware.userAuth, authMiddleware.adminAuth);

module.exports = router;

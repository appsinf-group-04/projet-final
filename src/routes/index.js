const router = require("express").Router();
const authRouter = require("./auth");
const authMiddleware = require("../middlewares/auth");
const {
  getAccountsCreatedByDay,
  getBansOverTime,
  getAccountsOverTime,
} = require("../database/stats");

router.use("/auth", authRouter);

router.get("/", (_, res) => {
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
  res.render("pages/index", { loggedIn: false, annonces });
});

router.get("/profile", (_, res) => {
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

  res.render("pages/profile", { loggedIn: false, annonces });
});

router.get("/details", (_, res) => {
  res.render("pages/details", { loggedIn: false });
});

router.get("/profile/create", (_, res) => {
  res.render("pages/create");
});

router.get("/dash", async (_req, res) => {
  const accountsByDay = await getAccountsCreatedByDay();
  const bansOverTime = await getBansOverTime();
  const accountsOverTime = await getAccountsOverTime();

  res.render("pages/dashboard", {
    accountsByDay,
    bansOverTime,
    accountsOverTime,
  });
});

// example of middleware usage, this route is protected and cannot be accessed without being logged in
router.get("/xxx", authMiddleware.userAuth);
router.get("/xxx", authMiddleware.adminAuth);

// you can even chain them
router.get("/xxx", authMiddleware.userAuth, authMiddleware.adminAuth);

module.exports = router;

const router = require("express").Router();
const authRouter = require("./auth");
const authMiddleware = require("../middlewares/auth");

router.use("/auth", authRouter);

router.get("/", (_, res) => {
  res.render("pages/index");
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

router.get("/profile/create", (_, res) => {
  res.render("pages/create");
});

// example of middleware usage, this route is protected and cannot be accessed without being logged in
router.get("/xxx", authMiddleware.userAuth);
router.get("/xxx", authMiddleware.adminAuth);

// you can even chain them
router.get("/xxx", authMiddleware.userAuth, authMiddleware.adminAuth);

module.exports = router;

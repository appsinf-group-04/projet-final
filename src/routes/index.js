const router = require("express").Router();
const authRouter = require("./auth");
const authMiddleware = require("../middlewares/auth");

router.use("/auth", authRouter);

router.get("/", (_, res) => {
  let annonces = [
    {
      seller: "Jean Mahmoud",
      sellerRating: 2.11,
      objectName: "Livre de math",
      price: 11,
      state: "Nul à chier"
    },
    {
      seller: "Abdul Kader",
      sellerRating: 4,
      objectName: "Livre d'anglais",
      price: 40,
      state: "Très bon"
    }
  ];
  res.render("pages/index", { loggedIn: false, annonces });
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

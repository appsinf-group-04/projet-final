const router = require("express").Router();
const authRouter = require("./auth");
const authMiddleware = require("../middlewares/auth");

router.use("/auth", authRouter);

router.get("/", (_, res) => {
  res.render("index");
});

// example of middleware usage, this route is protected and cannot be accessed without being logged in
router.get("/xxx", authMiddleware.userAuth);
router.get("/xxx", authMiddleware.adminAuth);

// you can even chain them
router.get("/xxx", authMiddleware.userAuth, authMiddleware.adminAuth);

module.exports = router;

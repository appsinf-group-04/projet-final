const router = require("express").Router();

router.get("/", (_, res) => {
  res.render("pages/index", { loggedIn: false });
});

module.exports = router;

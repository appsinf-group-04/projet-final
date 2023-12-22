function userAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

function adminAuth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/auth/login");
  }

  if (req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
}

module.exports = { userAuth, adminAuth };

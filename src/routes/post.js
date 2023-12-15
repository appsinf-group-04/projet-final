const { Router } = require("express");
const router = Router();
const { z } = require("zod");
const authMiddleware = require("../middlewares/auth");

const { createPost } = require("../database/post");
const { getUserByEmail } = require("../database/auth");

router.get("/profile/create", authMiddleware.userAuth, (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;
  const isAuth = req.session.user ? true : false;
  const user = req.session.user;

  res.render("pages/create", { errors, formData, isAuth, user });
  req.session.errors = null;
  req.session.formData = null;
});

const CreateSchema = z.object({
  title: z.string().min(5).max(40),
  description: z.string().optional(),
  price: z.number().positive(),
  state: z.string(),
  image: z.array(z.string()).optional(),
});

router.post("/profile/create", async (req, res) => {
  const body = req.body;

  const zodResult = CreateSchema.safeParse(body);

  if (!zodResult.success) {
    const errors = [];

    for (const issue of zodResult.error.issues) {
      errors.push({
        message: issue.message,
        path: issue.path[0],
      });
    }
    req.session.errors = errors;
    req.session.formData = body;

    return res.redirect("/profile/create");
  }
});

module.exports = router;

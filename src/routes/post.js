const { Router } = require("express");
const router = Router();
const { z } = require("zod");
const authMiddleware = require("../middlewares/auth");

const { createPost, setPictures, getPost } = require("../database/post");
const { banUser } = require("../database/auth");

router.get("/profile/create", authMiddleware.userAuth, (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;
  const user = req.session.user;

  res.render("pages/create", { errors, formData, user });
  req.session.errors = null;
  req.session.formData = null;
});

const states = z.enum(["great", "good", "ok", "used"]);
const createSchema = z.object({
  title: z.string().min(5).max(40),
  description: z.string().optional(),
  price: z.number().positive(),
  state: states,
  image: z.array(z.string()).optional(),
});

router.post("/profile/create", authMiddleware.userAuth, async (req, res) => {
  const body = req.body;

  body.price = parseInt(body.price);

  const zodResult = createSchema.safeParse(body);

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

  const userID = req.session.user.id;

  // add a post to the db
  const post = await createPost(
    zodResult.data.title,
    zodResult.data.price,
    zodResult.data.state,
    zodResult.data.description,
    userID,
  );

  const images = JSON.parse(req.body.base64);
  await setPictures(post.id, images);

  req.session.formData = null;
  req.session.errors = null;
  return res.redirect("/");
});

router.get("/post/:id", async (req, res) => {
  const id = req.params.id;
  const post = await getPost(id);

  return res.render("pages/details", { post, user: req.session.user });
});

// Route qui requiert un compte administrateur connecté afin de banir un utilisateur
router.post("/banUser/:email", authMiddleware.adminAuth, async (req, res) => {
  const { reasonForBan } = req.body;
  const userEmail = req.params.email
  await banUser(userEmail, reasonForBan);
  res.redirect('/');
});

module.exports = router;

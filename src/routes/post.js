const { Router } = require("express");
const router = Router();
const { z } = require("zod");

// middlewares and functions import
const authMiddleware = require("../middlewares/auth");
const {
  createPost,
  setPictures,
  getPost,
  deletePost,
  getPostById,
} = require("../database/post");
const { banUser } = require("../database/auth");
const { isUserAuthorized } = require("../utils/utils");

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

// Detailed post page route
router.get("/post/:id", async (req, res) => {
  const id = req.params.id;
  const post = await getPost(id);

  return res.render("pages/details", { post, user: req.session.user });
});

// Handles the ban of a user with an admin account
router.post("/banUser/:email", authMiddleware.adminAuth, async (req, res) => {
  const { reasonForBan } = req.body;
  const userEmail = req.params.email;
  await banUser(userEmail, reasonForBan);
  res.redirect("/");
});

router.post("/deletePost/:id", authMiddleware.adminAuth, async (req, res) => {
  const postID = req.params.id;
  await deletePost(postID);
  const post = await getPostById(postID);
  console.log(isUserAuthorized(req.session.user, post))
  res.redirect("/");
});

router.post("/deletePost/:id", authMiddleware.userAuth, async (req, res) => {
  const postID = req.params.id;

  try {
    const post = await getPostById(postID);

    // Vérifie si l'utilisateur est autorisé à supprimer ce post
    if (!isUserAuthorized(req.session.user, post)) {
      console.log(isUserAuthorized(req.session.user, post));
      return res.redirect("/");
    }

    // Supprime le post si l'utilisateur est autorisé
    await deletePost(postID);
    res.redirect("/");
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

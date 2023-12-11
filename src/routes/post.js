const { Router } = require("express");
const router = Router();
const { z } = require("zod");

const { createPost } = require("../database/post");
const { getUserByEmail } = require("../database/auth");

router.get("/create-post", (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;
  const isAuth = req.session.user ? true : false;
  const user = req.session.user;

  res.render("pages/create-post", { errors, formData, isAuth, user });
  req.session.errors = null;
  req.session.formData = null;
});

const CreatePostSchema = z.object({
  title: z.string(),
  price: z.number().positive(),
  state: z.string(),
  description: z.string().optional(),
  pictures: z.array(z.string()).optional(),
});
router.post("/create-post", async (req, res) => {
  const body = req.body;

  const zodResult = CreatePostSchema.safeParse(body);

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
    return res.redirect("/post/create-post");
  }

  // Assuming you have a middleware to check if the user is authenticated
  const userEmail = req.session.user.email; // Change this based on your user session structure
  const user = await getUserByEmail(userEmail);

  const post = await createPost({
    title: zodResult.data.title,
    price: zodResult.data.price,
    state: zodResult.data.state,
    description: zodResult.data.description,
    pictures: zodResult.data.pictures,
    refUser: user._id,
  });

  req.session.errors = null;
  req.session.formData = null;

  res.redirect("/profile"); // Attention que de base c'est / 
});

module.exports = router;
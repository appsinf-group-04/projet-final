const { Router } = require("express");
const router = Router();
const { z } = require("zod");
const authMiddleware = require("../middlewares/auth");


const {createPost} = require("../database/auth");


router.get("/profile/create", authMiddleware.userAuth, (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;
  const user = req.session.user;

  res.render("pages/create", { errors, formData, user });
  req.session.errors = null;
  req.session.formData = null;
});

const createSchema = z.object({
  title: z.string().min(5).max(40),
  description: z.string().optional(),
  price: z.number().positive(),
  state: z.string(),
  image: z.array(z.string()).optional(),
});

router.post("/profile/create", authMiddleware.userAuth, async (req, res) => {
  const body = req.body;
  
  // convert form price from string to int
  body.price = parseInt(body.price);
  console.log(body);

  const zodResult = createSchema.safeParse(body);

  // if at least one form element is incorrect
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

    console.log(req.session.errors)

    return res.redirect("/profile/create");
  }

  const userID = req.session.user.id;
  const userName = req.session.user.userName;
  const post = await createPost(
    zodResult.data.title, 
    zodResult.data.price,
    zodResult.data.state,
    zodResult.data.description,
    userID,
    userName,
    )
  return res.redirect("/");
});

module.exports = router;

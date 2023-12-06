const { Router } = require("express");
const router = Router();
const { z } = require("zod");

const {
  createUser,
  getUserByEmail,
  testPassword,
} = require("../database/auth");
const { isPhoneNumber, isAuthorizedEmail } = require("../utils/utils");

router.get("/login", (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;
  const isAuth = req.session.user ? true : false;
  const user = req.session.user;

  res.render("pages/login", { errors, formData, isAuth, user });
  req.session.errors = null;
  req.session.formData = null;
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
router.post("/login", async (req, res) => {
  const body = req.body;

  const zodResult = LoginSchema.safeParse(body);

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

    return res.redirect("/auth/login");
  }

  const userExists = await getUserByEmail(zodResult.data.email);
  if (!userExists) {
    req.session.errors = [
      {
        message: "User with this email does not exist",
        path: "email",
      },
    ];
    req.session.formData = body;
    return res.redirect("/auth/login");
  }

  const isBanned = userExists.ban.banned;
  if (isBanned) {
    req.session.errors = [
      {
        message:
          "This account has been banned. Contact an admin for more informations.",
        path: "email",
      },
    ];
    req.session.formData = body;
    return res.redirect("/auth/login");
  }

  const passwordCorrect = await testPassword(
    zodResult.data.email,
    zodResult.data.password,
  );
  if (!passwordCorrect) {
    req.session.errors = [
      {
        message: "Incorrect password",
        path: "password",
      },
    ];
    req.session.formData = body;
    return res.redirect("/auth/login");
  }

  req.session.user = { name: userExists.name, role: userExists.role };
  req.session.errors = null;
  //
  //TODO: change this to redirect to /
  return res.redirect("/auth/login");
});

router.get("/register", (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;

  res.render("pages/register", { errors, formData });
  req.session.errors = null;
  req.session.formData = null;
});

const registerSchema = z.object({
  email: z
    .string()
    .email()
    .refine(isAuthorizedEmail, "Only UCLouvain emails are allowed"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  phone: z.string().refine(isPhoneNumber, "Phone number must be valid"),
  name: z.string().min(2, "Name must be at least 2 characters long"),
  profilePicture: z.string().optional(),
});
router.post("/register", async (req, res) => {
  const body = req.body;

  const zodResult = registerSchema.safeParse(body);

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
    return res.redirect("/auth/register");
  }

  const userAlreadyExists = await getUserByEmail(zodResult.data.email);
  if (userAlreadyExists) {
    req.session.errors = [
      {
        message: "A user with this email already exists",
        path: "email",
      },
    ];
    req.session.formData = body;
    return res.redirect("/auth/register");
  }

  const user = await createUser(
    zodResult.data.email,
    zodResult.data.password,
    zodResult.data.phone,
    zodResult.data.name,
    zodResult.data.profilePicture,
  );
  req.session.user = { name: user.name, role: user.role };
  req.session.errors = null;

  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

module.exports = router;
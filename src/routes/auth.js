const { Router } = require("express");
const router = Router();
const { z } = require("zod");

// middlewares and functions import
const authMiddleware = require("../middlewares/auth");
const {
  createUser,
  getUserByEmail,
  testPassword,
  unbanUser,
  logLogin,
  banUser,
} = require("../database/auth");
const { isPhoneNumber, isAuthorizedEmail } = require("../utils/utils");
const { logNewLogin } = require("../database/logins");

// Login page route
router.get("/login", (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;
  const user = req.session.user;

  res.render("pages/login", { errors, formData, user });
  req.session.errors = null;
  req.session.formData = null;
});

// Zod object for checking the provided data to log in
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Handles the login
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
        message: "Utilisateur avec cet email n'existe pas",
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
          "Ce compte a été banni. Contactez un admin pour plus d'informations.",
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
        message: "Mot de passe incorrect",
        path: "password",
      },
    ];
    req.session.formData = body;
    return res.redirect("/auth/login");
  }

  req.session.user = {
    name: userExists.name,
    role: userExists.role,
    email: userExists.email,
    id: userExists._id,
  };
  req.session.errors = null;

  await logLogin(zodResult.data.email);

  return res.redirect("/");
});

// Register page route
router.get("/register", (req, res) => {
  const errors = req.session.errors;
  const formData = req.session.formData;
  const user = req.session.user ? true : false;

  res.render("pages/register", { errors, formData, user });
  req.session.errors = null;
  req.session.formData = null;
});

// Zod object for checking the provided data to create an account
const registerSchema = z.object({
  email: z
    .string()
    .email()
    .refine(isAuthorizedEmail, "Seulement les emails UCLouvain sont autorisés"),
  password: z
    .string()
    .min(8, "Le mot de passe doit faire au moins 8 caractères"),
  phone: z.string().refine(isPhoneNumber, "Numéro de téléphone invalide"),
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  profilePicture: z.string().optional(),
});

// Handle the creation of a new account
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
        message: "Un utilisateur avec cet email existe déjà",
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
  req.session.user = {
    name: user.name,
    role: user.role,
    email: user.email,
    id: user._id,
  };
  req.session.errors = null;

  await logLogin(zodResult.data.email);
  await logNewLogin();

  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/auth/login");
});

// handles the unbanning of a user
router.get("/unban/:email", authMiddleware.adminAuth, async (req, res) => {
  const email = req.params.email;

  await unbanUser(email);

  res.redirect("/dash#search-bar");
});

// Handles the ban of a user with an admin account
router.post("/ban/:email", authMiddleware.adminAuth, async (req, res) => {
  const { reasonForBan } = req.body;
  const userEmail = req.params.email;

  await banUser(userEmail, reasonForBan);

  res.redirect("/");
});

module.exports = router;

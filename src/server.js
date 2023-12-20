const path = require("path");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const { getPosts, createPost, getPost } = require("./database/post");

const app = express();

app
  .set("view engine", "ejs")
  .use(express.json({ limit: "50mb" }))
  .use(express.urlencoded({ extended: true, limit: "50mb" }))
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: false,
    }),
  )
  .use("/public", express.static(path.join(__dirname, "..", "public")))
  .use("/", require("./routes/index"));

app.listen(process.env.PORT || 8080, () => {
  console.log("Listening at http://localhost:8080");

  mongoose
    .connect("mongodb://127.0.0.1:27017/projet-final")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));
});

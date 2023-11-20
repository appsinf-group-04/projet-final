const path = require("path");
const express = require("express");

const app = express();

app
  .set("view engine", "ejs")
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use("/public", express.static(path.join(__dirname, "..", "public")))
  .use("/", require("./routes/index"));

app.listen(process.env.PORT || 8080, () => {
  console.log("Listening at http://localhost:8080");
});

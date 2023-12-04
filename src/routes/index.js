const router = require("express").Router();

router.get("/", (_, res) => {
  res.render("index");
});

router.get("/profile", (_, res) => {

  let annonces = [
    {
      img: "/public/images/book_placeholder.png",
      seller: "Jean Mahmoud",
      objectName: "Livre de math",
      price: 11,
      state: "Nul à chier"
    },
    {
      img: "/public/images/book_placeholder.png",
      seller: "Abdul Kader",
      objectName: "Livre d'anglais",
      price: 40,
      state: "Très bon"
    },
    {
      img: "/public/images/book_placeholder.png",
      seller: "Max Günter",
      objectName: "Livre d'allemand",
      price: 35,
      state: "Bon"
    },
    {
      img: "/public/images/book_placeholder.png",
      seller: "Olaf Müller",
      objectName: "Livre d'histoire",
      price: 65,
      state: "Très bon"
    }
  ];


  res.render("pages/profile", { loggedIn: false, annonces });
});

module.exports = router;

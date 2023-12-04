const router = require("express").Router();

router.get("/", (_, res) => {
  
  let annonces = [
    {
      seller: "Jean Mahmoud",
      sellerRating: 2.11,
      objectName: "Livre de math",
      price: 11,
      state: "Nul à chier"
    },
    {
      seller: "Abdul Kader",
      sellerRating: 4,
      objectName: "Livre d'anglais",
      price: 40,
      state: "Très bon"
    }
  ];
  res.render("pages/index", { loggedIn: false, annonces });
});

module.exports = router;

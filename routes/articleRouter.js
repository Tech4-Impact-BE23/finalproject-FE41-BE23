// import controllers review, articles
const articleController = require("../controllers/articleController.js");

// router
const router = require("express").Router();

// use routers
router.post(
  "/addArticle",
  // articleController.upload,
  articleController.addArticle
);

router.get("/allArticles", articleController.getAllArticles);

// Articles router
router.get("/:id", articleController.getOneArticle);

router.put("/:id", articleController.updateArticle);

router.delete("/:id", articleController.deleteArticle);

router.get("/search/:title", articleController.searchArticle);

module.exports = router;

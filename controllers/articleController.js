const { Op } = require("sequelize");
const db = require("../models");

// image Upload
const multer = require("multer");
const path = require("path");

// create main Model
const Article = db.articles;

// main work

// 1. create article
const addArticle = async (req, res) => {
  try {
    let data = {
      // image: req.file.path,
      title: req.body.title,
      description: req.body.description,
      img_link: req.body.img_link,
    };

    const article = await Article.create(data);
    res.status(200).send(article);
    console.log(article);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// 2. get all articles
const getAllArticles = async (req, res) => {
  try {
    let articles = await Article.findAll({});
    res.status(200).send(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// 3. get single article
const getOneArticle = async (req, res) => {
  try {
    let id = req.params.id;
    let article = await Article.findOne({ where: { id: id } });
    res.status(200).send(article);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// 4. update article
const updateArticle = async (req, res) => {
  try {
    let id = req.params.id;

    const [rowsUpdated] = await Article.update(req.body, {
      where: { id: id },
    });

    if (rowsUpdated === 0) {
      return res.status(404).send("Article not found");
    }

    const updatedArticle = await Article.findOne({ where: { id: id } });

    res.status(200).send(updatedArticle);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// 5. delete article by id
const deleteArticle = async (req, res) => {
  try {
    let id = req.params.id;

    await Article.destroy({ where: { id: id } });

    res.status(200).send("Article is deleted !");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// 6. search article
const searchArticle = async (req, res) => {
  try {
    let title = req.params.title;
    let article = await Article.findAll({
      where: {
        title: {
          [Op.like]: `%${title}%`,
        },
      },
    });
    res.status(200).send(article);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// 8. Upload Image Controller
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

module.exports = {
  addArticle,
  getAllArticles,
  getOneArticle,
  updateArticle,
  deleteArticle,
  searchArticle,
};

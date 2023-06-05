require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const config = require("./config/config");
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const sequelize = new Sequelize(config.development);

const users = require("./models/users")(sequelize);
const forums = require("./models/forums")(sequelize);
const posts = require("./models/posts")(sequelize);
const categories = require("./models/categories")(sequelize);

users.hasMany(posts, { foreignKey: "userId" });
forums.hasMany(posts, { foreignKey: "forumsId" });
categories.hasMany(posts, { foreignKey: "categoriesId" });
posts.belongsTo(users, { foreignKey: "userId" });
posts.belongsTo(forums, { foreignKey: "forumsId" });
posts.belongsTo(categories, { foreignKey: "categoriesId" });

app.get("/", (req, res) => {
    res.send("TRY");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if the user with the given email already exists
        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "User with the provided email already exists." });
        }

        const defaultRole = role ? role : "user";

        // Create a new user
        const newUser = await users.create({
            name,
            email,
            password,
            role: defaultRole,
        });

        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password.",
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "86400s",
            }
        );

        if (user.role !== "admin") {
            res.json({
                status: "Succes",
                token: token,
                role: user.role,
                massage: "Welcome User",
            });
        } else {
            res.json({
                status: "Succes",
                token: token,
                role: user.role,
                massage: "Welcome Admin",
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
});

app.post('/forums', async (req, res) => {
    try {
        const { name, desc } = req.body;

        const newForum = await forums.create({
            name,
            desc,
        });

        res.status(201).json({ message: 'Forum created successfully.', forum: newForum });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/forums', async (req, res) => {
    try {
        const allforums = await forums.findAll();
        res.status(201).json({ massage: 'Menampilkan semua forum', forum: allforums });
    }
    catch (error) {
        res.status(500).json({ error: error.massage });
    }
});

app.post('/categories', async (req, res) => {
    try {
        const { name, desc } = req.body;

        const newCategory = await categories.create({
            name,
            desc,
        });

        res.status(201).json({ message: 'Category created successfully.', category: newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/categories', async (req, res) => {
    try {
        const allcategories = await categories.findAll();
        res.status(201).json({ massage: 'Menampilkan semua categories', forum: allcategories });
    }
    catch (error) {
        res.status(500).json({ error: error.massage });
    }
});

app.post('/posts', async (req, res) => {
    try {
        const { title, content, userId, categoriesId, forumsId } = req.body;

        const user = await users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const forum = await forums.findByPk(forumsId);
        if (!forum) {
            return res.status(404).json({ message: 'Forum not found.' });
        }

        const category = await categories.findByPk(categoriesId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }

        const newPost = await posts.create({
            title,
            content,
            userId,
            forumsId,
            categoriesId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({ message: 'Post created successfully.', post: newPost });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const allposts = await posts.findAll();
        res.status(201).json({ massage: 'Menampilkan semua posts', forum: allposts });
    }
    catch (error) {
        res.status(500).json({ error: error.massage });
    }
});

app.get('/forums-posts', async (req, res) => {
    try {
        const categoryId = req.query.categoriesId;
        if (categoryId) {
            const forumPosts = await posts.findAll({
                attributes: ['categoriesId'],
                include: [forums], where: {
                    categoriesId: categoryId
                }
            })
            res.status(201).json({ forum: forumPosts });
            return
        }

        const forumPosts = await posts.findAll({ include: [forums] });
        res.status(201).json({ forum: forumPosts });
    } catch (error) {
        res.status(500).json({ error: error.massage });
    }
})


sequelize
    .sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`server running on port ${port}`);
        });
    }).catch((error) => {
        console.log("Unable to connect to the database:", error);
    });
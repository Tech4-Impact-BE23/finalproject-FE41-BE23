require("dotenv").config();
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const config = require("./config/config");
const cors = require('cors');
const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const sequelize = new Sequelize(config.development);

const users = require("./models/users")(sequelize);
const forums = require("./models/forums")(sequelize);
const posts = require("./models/posts")(sequelize);
const categories = require("./models/categories")(sequelize);
const comments = require("./models/comments")(sequelize);
const commentsReaction = require("./models/commentsreaction")(sequelize);

users.hasMany(posts, { foreignKey: "userId" });
users.hasMany(comments, { foreignKey: "userId" });
users.hasMany(commentsReaction, { foreignKey: "userId" });
forums.hasMany(posts, { foreignKey: "forumsId" });
categories.hasMany(posts, { foreignKey: "categoriesId" });
posts.hasMany(comments, { foreignKey: "postId" });
posts.belongsTo(users, { foreignKey: "userId" });
posts.belongsTo(forums, { foreignKey: "forumsId" });
posts.belongsTo(categories, { foreignKey: "categoriesId" });
comments.belongsTo(posts, { foreignKey: "postId" });
comments.belongsTo(users, { foreignKey: "userId" });
comments.hasMany(commentsReaction, { foreignKey: "commentId" });
commentsReaction.belongsTo(users, { foreignKey: "userId" });
commentsReaction.belongsTo(comments, { foreignKey: "commentId" });



app.get("/", (req, res) => {
    res.send("TRY");
});

// User Register 
app.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Check if the user with the given email already exists
        const existingUser = await users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({
                message: "User with the provided email already exists."
            });
        }
        const defaultRole = role ? role : "user";

        // Create a new user
        const newUser = await users.create({
            name,
            email,
            password,
            role: defaultRole,
        });
        res.status(201).json({
            message: "User created successfully.", user: newUser
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Login
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

// User Add forums
app.post('/forums', auth, async (req, res) => {
    try {
        const { name, desc } = req.body;

        const newForum = await forums.create({
            name,
            desc,
        });

        res.status(201).json({
            message: 'Forum created successfully.', data: newForum
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Get Forum
app.get('/forums', auth, async (req, res) => {
    try {
        const allforums = await forums.findAll();
        res.status(201).json({
            massage: 'Menampilkan semua forum', data: allforums
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.massage
        });
    }
});

// User Update Forum by id forum
app.put('/forums/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc } = req.body;

        console.log('ID:', id); // Check the ID sudah diterima

        const forum = await forums.findByPk(id);
        console.log('Forum:', forum); // Check the forum object

        if (!forum) {
            return res.status(404).json({
                message: 'Forum not found.'
            });
        }

        forum.name = name;
        forum.desc = desc;
        await forum.save();

        res.status(200).json({
            message: 'Forum updated successfully.', data: forum
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Delete forums by Id
app.delete('/forums/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const forum = await forums.findByPk(id); // Pass the ID directly

        if (!forum) {
            return res.status(404).json({
                message: "Forum not found.",
            });
        }

        await forum.destroy(); // Use the forum instance to delete

        res.json({
            message: "Forum deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Admin Delete All Forum
app.delete('/forums', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'You are not authorized to perform this action.',
            });
        };
        await forums.destroy({
            where: {},
        });
        res.json({
            message: "All Forums deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Add new categories
app.post('/categories', auth, async (req, res) => {
    try {
        const { name, desc } = req.body;

        const newCategory = await categories.create({
            name,
            desc,
        });

        res.status(201).json({
            message: 'Category created successfully.', data: newCategory
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Get Categories
app.get('/categories', auth, async (req, res) => {
    try {
        const allcategories = await categories.findAll();
        res.status(201).json({
            massage: 'Menampilkan semua categories', data: allcategories
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.massage
        });
    }
});

// User Update Categories by id 
app.put('/categories/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, desc } = req.body;

        console.log('ID', id);

        const categorie = await categories.findByPk(id);
        console.log('Categories:', categorie);

        if (!categorie) {
            return res.status(404).json({
                message: 'Categories not found.'
            });
        }

        categorie.name = name;
        categorie.desc = desc;
        await categorie.save();

        res.status(200).json({
            massage: 'Categories updated successfully.', data: categorie
        });
    } catch (error) {
        res.status(500).json({
            error: error.massage
        });
    }
});

// User Delete Categories by Id
app.delete('/categories/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const categorie = await categories.findByPk(id);

        if (!categorie) {
            return res.status(404).json({
                massage: "Categories not found",
            });
        }

        await categorie.destroy();

        res.json({
            message: "Categories deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Admin Delete All Categories
app.delete('/categories', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'You are not authorized to perform this action.',
            });
        };
        await categories.destroy({
            where: {},
        });
        res.json({
            message: "All Categories deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Add new Post
app.post('/posts', auth, async (req, res) => {
    try {
        const { title, content, userId, categoriesId, forumsId } = req.body;

        const user = await users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        const forum = await forums.findByPk(forumsId);
        if (!forum) {
            return res.status(404).json({
                message: 'Forum not found.'
            });
        }

        const category = await categories.findByPk(categoriesId);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found.'
            });
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

        res.status(201).json({
            message: 'Post created successfully.', data: newPost
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Get All Posts
app.get('/posts', auth, async (req, res) => {
    try {
        const allposts = await posts.findAll({
            include: [forums, categories, users]
        });
        res.status(201).json({
            massage: 'Menampilkan semua posts', data: allposts
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.massage
        });
    }
});

// User Update posts
app.put('/posts/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, userId, categoriesId, forumsId } = req.body;

        console.log('ID', id);

        const post = await posts.findByPk(id);
        console.log('Posts:', categories);

        if (!post) {
            return res.status(404).json({
                message: 'Forum not found.'
            });
        }

        post.title = title;
        post.content = content;
        post.userId = userId;
        post.categoriesId = categoriesId;
        post.forumsId = forumsId;
        await post.save();

        res.status(200).json({
            message: 'Post updated succesfully.', data: post
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Delete Forum by Id
app.delete('/posts/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const post = await posts.findByPk(id);

        if (!post) {
            return res.status(404).json({
                message: "Posts not found",
            });
        }

        await post.destroy();

        res.json({
            message: "Posts deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Admin Delete All Posts
app.delete('/posts', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: 'You are not authorized to perform this action.',
            });
        }
        await posts.destroy({
            where: {},
        });
        res.json({
            message: 'All Posts deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Add new comments
app.post('/comments', auth, async (req, res) => {
    try {
        const { content, postId, userId } = req.body;

        const post = await posts.findByPk(postId);
        if (!post) {
            return res.status(404).json({
                message: 'Post not found.'
            });
        }

        const user = await users.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.'
            });
        }

        const newComment = await comments.create({
            content,
            postId,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.status(201).json({
            message: 'Comment created successfully.', data: newComment
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
});

// User Get all comments
app.get('/comments', auth, async (req, res) => {
    try {
        const allComments = await comments.findAll({
            attributes: ['id', 'content', 'createdAt', 'updatedAt'],
            include: [posts, users]
        }); // Retrieve all comments

        res.status(200).json(allComments); // Send the comments as JSON response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Update comments
app.put('/comments/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { content, postId, userId } = req.body;

        console.log('ID', id);

        const comment = await comments.findByPk(id);
        console.log('Comments:', comment);

        if (!comment) {
            return res.status(404).json({
                message: 'Comments not found.'
            });
        }

        comment.content = content;
        comment.postId = postId;
        comment.userId = userId;
        await comment.save();

        res.status(200).json({
            message: 'Comment updated successfully.', data: comment
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// User Delete Comment by Id
app.delete('/comments/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await comments.findByPk(id);

        if (!comment) {
            return res.status(404).json({
                message: "Comments not found",
            });
        }

        await comment.destroy();

        res.json({
            message: "Comments deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Admin Delete All comments
app.delete('/comments', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "You are not authorized to perform this action.",
            });
        }
        await comments.destroy({
            where: {},
        });
        res.json({
            message: "All Commenst deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

app.get('/forums-posts', async (req, res) => {
    try {
        const forumId = req.query.forumsId;
        if (forumId) {
            const forumPosts = await posts.findAll({
                // attributes: ['categoriesId'],
                include: [forums, comments],
                where: {
                    categoriesId: forumId
                }
            })
            res.status(201).json(forumPosts);
            return
        }

        // const forumPosts = await posts.findAll({ include: [forums] });
        // res.status(201).json({ forum: forumPosts });
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
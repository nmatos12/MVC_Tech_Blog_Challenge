const router = require("express").Router();
const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const Comment = require("../models/Comment");
const moment = require('moment');
const formattedDate = moment().format('MMMM Do YYYY, h:mm a')

function isAuthenticated(req, res, next) {
    if (!req.session.user_id) {
        return res.redirect('/login');
    }
    next();
}

router.get('/dashboard', isAuthenticated, async (req, res) => {
    if (!req.secure.viewCount) {
        req.session.viewCount = 1;
    } else {
        req.session.viewCount += 1;
    }

    if (req.session.user_id == null) {
        res.redirect("/login");
        return;
    }

    console.log(' how can I find a user without an id ', req.session)

    const user = await User.findByPk(req.session.user_id);

    console.log(' where is my data ', user);

    let posts;
    if (req.session.userEmail) {
        posts = await BlogPost.findAll({
            raw: true,
            where: {
                userName: req.session.userEmail,
            },
        });
    } else {
        posts = await BlogPost.findAll({
            raw: true,
        });
    }

    res.render('dashboard', {
        email: user.email,
        blogPost: posts,
    });
});

router.post("/dashboard", isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.session.user_id }
        });

        console.log('user.userName ' + user.email)

        if (!user) {
            throw new Error("User not found");
        } else if (!req.body.text) {
            throw new Error("A post is required");
        }

        const post = await BlogPost.create({
            title: req.body.title,
            userName: user.email,
            text: req.body.text

        });

        res.redirect(`/dashboard`);

    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/posts/:id", isAuthenticated, async (req, res) => {
    try {

        const post = await BlogPost.findByPk(req.params.id);

        console.log(' is this undefined? ', req.session.user_id);

        const user = await User.findOne({
            where: { id: req.session.user_id }
        });

        if (!user) {
            throw new Error("User not found");
        } else if (!req.body.comment_text) {
            throw new Error("A comment is required");
        }


        const formattedDateComment = moment().format('MMMM Do YYYY, h:mm a');
        const comment = await Comment.create({
            comment_text: req.body.comment_text,
            user_id: user.id,
            post_id: post.id,
            updatedAt: formattedDateComment,
        });

        res.redirect(`/posts/${post.id}`);

    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;
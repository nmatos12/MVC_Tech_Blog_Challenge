const router = require("express").Router();
const BlogPost = require("../models/BlogPost");
const User = require("../models/User");
const Comment = require("../models/Comment");
const moment = require('moment');
const { format } = require("mysql2");

router.get("/", async (req, res) => {
  if (!req.secure.viewCount) {
    req.session.viewCount = 1;
  } else {
    req.session.viewCount += 1;
  }

  const posts = await BlogPost.findAll({
    raw: true,
  });


  function iWantMyDate() {
    for (i = 0; i < posts.length; i++) {
      let formattedDate = moment(posts[i].updatedAt).format('MMMM Do YYYY, h:mm a');
      posts[i].updatedAt = formattedDate
      console.log(posts)
    }

  }


  res.render("index", {
    blogPost: posts,
    updatedAt: iWantMyDate(),
  });
});


router.get("/posts/:id", async (req, res) => {
  const post = await BlogPost.findOne({
    where: {
      id: req.params.id,
    },
    raw: true,
  });

  const getComments = await Comment.findAll({
    where: {
      post_id: req.params.id
    },
    raw: true
  });

  for (i = 0; i < getComments.length; i++) {
    const comment = getComments[i];
    comment.updatedAt = moment(comment.updatedAt).format('MMMM Do YYYY, h:mm a');
  };

  const users = await User.findAll({
    where: {
      id: getComments.map(function (comment) {
        return comment.user_id;
      })
    }
  })

  for (var c = 0; c < getComments.length; c++) {
    const comment = getComments[c];
    for (var u = 0; u < users.length; u++) {
      const user = users[u];
      if (comment.user_id == user.id) {
        comment.user_email = user.email;
        break;
      }
    }
  }

  if (post) {
    let formattedDate = moment(post.updatedAt).format('MMMM Do YYYY, h:mm a');

    res.render("posts", {
      id: post.id,
      title: post.title,
      userName: post.userName,
      text: post.text,
      updatedAt: formattedDate,
      comments: getComments,
    });
  } else {
    res.status(404).send("Blog post not found");
  }

});

router.get("/login", async (req, res) => {
  res.render("login");
});

router.get("/register", async (req, res) => {
  res.render("register");
});

module.exports = router;
const router = require('express').Router();
const { BlogPost } = require("../models/BlogPost");

router.get("/:id"), async (req, res) => {
    const postId = req.params.id;

    if (postId) {
        const post = await BlogPost.findOne({
            where: {
                id: postId
            }
        })
        res.send(postId)
    } else res.send("Blog post cannot be found.")

}

module.exports = router;
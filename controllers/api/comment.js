const { application } = require("express");
const { Comment } = require("../../models");
const { restore, beforeBulkDestroy } = require("../../models/user");
const { withAuth } = require("../../utils");

const router = require("express").Router();

// Get Blogs that belong to a blog
router.get("/getConnected:id", withAuth, async (req, res) => {
  const BlogId = req.params.id.slice(1);

  try {
    const dbComments = await Comment.findAll({
      where: {
        blogNum: BlogId,
      },
    });
    dbComments.map((comment) => comment.get({ plain: true }));
    res.status(200).json(dbComments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to retrieve comments.",
    });
  }
});

// Add Comment
router.post("/", withAuth, async (req, res) => {
  const { content, blogNum } = req.body;
  const posterId = req.session.userId;

  try {
    const newComment = await Comment.create({
      content,
      blogNum,
      posterId,
    });

    res.json(newComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to post your blog.",
    });
  }
});

// Get single comment from id
router.get("/getOne:id", withAuth, async (req, res) => {
  const commentId = req.params.id.slice(1);
  console.log(commentId);

  try {
    const dbComments = await Comment.findOne({
      where: {
        id: commentId,
      },
    });

    res.status(200).json(dbComments.content);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to retrieve comments.",
    });
  }
});

// Update one comment
router.put("/update:id", withAuth, async (req, res) => {
  const commentID = req.params.id.slice(1);
  const { content } = req.body;

  try {
    const commentToUpdate = await Comment.findOne({
      where: {
        id: commentID,
      },
    });

    if (commentToUpdate === null) {
      return res
        .status(404)
        .json({ message: "Couldn't find a comment with that id" });
    } else {
      commentToUpdate.update({
        content: content,
      });
      await commentToUpdate.save();
      return res.status(200).json({ message: "Successfully Updated Comment!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to update your comment.",
    });
  }
});

// Delete comment by id
router.delete("/delete:id", async (req, res) => {
  const commentId = req.params.id.slice(1);
  try {
    await Comment.destroy({
      where: { id: commentId },
    });

    return res.status(200).json({ message: "Deleted Comment Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to delete your comment.",
    });
  }
});

module.exports = router;

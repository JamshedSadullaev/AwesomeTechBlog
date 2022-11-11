const { Blog } = require("../../models");
const { restore, beforeBulkDestroy } = require("../../models/user");
const { withAuth } = require("../../utils");

const router = require("express").Router();

// Add Blog
router.post("/", withAuth, async (req, res) => {
  const { title, content } = req.body;
  const UserId = req.session.userId;

  try {
    const newBlog = await Blog.create({
      title,
      content,
      UserId,
    });

    res.json(newBlog);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to post your blog.",
    });
  }
});

// Get Blogs that belong to a user
router.get("/", withAuth, async (req, res) => {
  const UserId = req.session.userId;

  try {
    const dbBlogs = await Blog.findAll({
      where: {
        UserId,
      },
    });
    dbBlogs.map((blog) => blog.get({ plain: true }));
    res.status(200).json(dbBlogs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to post your blog.",
    });
  }
});

// Get one blog by id
router.get("/one:id", async (req, res) => {
  const blogId = req.params.id.slice(1);
  try {
    const foundBlog = await Blog.findOne({
      where: {
        id: blogId,
      },
    });
    if (foundBlog === null) {
      return res
        .status(404)
        .json({ message: "Couldn't find a post with that id" });
    } else {
      return res.status(200).json(foundBlog);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to find your blog.",
    });
  }
});

// Get All blogs
router.get("/all", async (req, res) => {
  try {
    const allBlogs = await Blog.findAll();
    res.status(200).json(allBlogs);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to post your blog.",
    });
  }
});

// Update one blog
router.put("/update:id", withAuth, async (req, res) => {
  const blogID = req.params.id.slice(1);
  const { title, content } = req.body;

  try {
    const postToUpdate = await Blog.findOne({
      where: {
        id: blogID,
      },
    });

    if (postToUpdate === null) {
      return res
        .status(404)
        .json({ message: "Couldn't find a post with that id" });
    } else {
      postToUpdate.update({
        title: title,
        content: content,
      });
      await postToUpdate.save();
      return res.status(200).json({ message: "Successfully Updated Post!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to update your blog.",
    });
  }
});

// Delete blog by id
router.delete("/delete:id", async (req, res) => {
  const blogId = req.params.id.slice(1);
  try {
    await Blog.destroy({
      where: { id: blogId },
    });

    return res
      .status(200)
      .json({ message: "Deleted Blog entry Successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong while trying to delete your blog entry.",
    });
  }
});

module.exports = router;

const router = require("express").Router();
const user = require("./user");
const blog = require("./blog");
const comment = require("./comment");

router.use("/user", user);
router.use("/blog", blog);
router.use("/comment", comment);

module.exports = router;

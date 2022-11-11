const router = require("express").Router();
const api = require("./api");
const html = require("./html");

router.use("/api", api);
router.use("/", html);

module.exports = router;

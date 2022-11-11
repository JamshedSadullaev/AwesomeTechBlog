const { User } = require("../../models");
const { restore } = require("../../models/user");

const router = require("express").Router();

// GET api/user route
router.get("/", async (req, res) => {
  if (req.session.loggedIn) {
    res.json({ message: "logged in" });
  } else {
    res.json({ message: "logged out" });
  }
  console.log("You're in the user route");
  res.end();
});

// Get User by ID
router.get("/findUser:userId", async (req, res) => {
  const userId = req.params.userId.slice(1);

  try {
    const findUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (findUser === null) {
      return res
        .status(404)
        .json({ message: "User not found" });
    } else {
      return res.status(200).json(findUser.username);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error to find user",
    });
  }
});

// Create New User route
router.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username, !email, !password)) {
    return res.status(400).json({
      message:
        "Must submit all info",
    });
  }

  try {
    const newUser = await User.create({
      username,
      email,
      password,
    });

    req.session.save(() => {
      req.session.loggedIn = true;
      req.session.userId = newUser.id;
      return res.status(201).json(newUser);
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "User could not created",
    });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return res
      .status(400)
      .json({ message: "Login not valid" });
  }

  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    const hasValidPass = user.checkPassword(password);

    if (hasValidPass) {
      req.session.save(() => {
        req.session.loggedIn = true;
        req.session.userId = user.id;
        return res.status(200).json(user);
      });
    } else {
      res
        .status(404)
        .json({ message: "incorrect password or login" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error to login",
    });
  }
});

// log out route
router.post("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

module.exports = router;

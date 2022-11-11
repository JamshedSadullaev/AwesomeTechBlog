module.exports = {
  withAuth: (req, res, next) => {
    if (req.session.loggedIn) {
      next();
    } else {
      res.status(500).json({ message: "Log in please " });
    }
  },
};

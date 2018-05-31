export default ({ redirect = true } = {}) => (req, res, next) => {
  // Check if a user session
  if (!req.isAuthenticated()) {
    if (redirect === true) {
      res.redirect("/");
    } else {
      res
        .status(403)
        .send("You are not authorized to access this page");
    }
    return;
  }

  const {
    user: { admin = false },
    path = ""
  } = req;

  if (admin) {
    return next();
  }

  next();
};

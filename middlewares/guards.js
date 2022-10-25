function hasUser() {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirec("/auth/login");
    }
  };
}

function isGuest() {
  return (req, res, next) => {
    if (req.user) {
      res.redirec("/"); //TODO: check assignment for correct redirect
    } else {
      next();
    }
  };
}

module.exports = {
  hasUser,
  isGuest,
};

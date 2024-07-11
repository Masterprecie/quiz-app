const rolesAllowed = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.userDetails.role)) {
      next();
    } else {
      res.status(403).send({
        message: "Your role is not allowed to access this route",
      });
    }
  };
};

module.exports = rolesAllowed;

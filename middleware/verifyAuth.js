const jwt = require("jsonwebtoken");

const verfiyAuth = (req, res, next) => {
  const strategyAndToken = req.headers.authorization.split(" ");
  // console.log(strategyAndToken);
  const strategy = strategyAndToken[0];
  const tokenItSelf = strategyAndToken[1];

  if (strategy == "Bearer") {
    const userDetails = jwt.verify(tokenItSelf, process.env.AUTH_SECRET);

    req.userDetails = userDetails;
    // console.log(req.userDetails);

    if (userDetails) {
      next();
    } else {
      res.status(403).send({
        message: "User details is empty for the token provided",
      });
    }
  } else {
    res.status(403).send({ message: "You are not authorized" });
  }
};

module.exports = verfiyAuth;

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.USER_SECRET;

function userMiddleware(req, res, next) {
  let token = req.headers.token;
  let user = jwt.verify(token, JWT_SECRET);
  if (user) {
    req.user = user;
    next();
  } else {
    res.json({
      message: "You are not logged in!",
    });
  }
}

module.exports = {
  userMiddleware,
};

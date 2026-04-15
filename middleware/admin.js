const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.ADMIN_SECRET;

function adminMiddleware(req, res, next) {
  let token = req.headers.token;
  let admin = jwt.verify(token, JWT_SECRET);
  if (admin) {
    req.admin = admin;
    next();
  } else {
    res.json({
      message: "You are not logged in!",
    });
  }
}

module.exports = {
  adminMiddleware,
};

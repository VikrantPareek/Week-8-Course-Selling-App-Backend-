require("dotenv").config();
const jwt = require("jsonwebtoken");
let JWT_SECRET = process.env.SECRET;

function isAdmin(req, res, next) {
  let token = req.headers.token;
  let decodedAdmin;
  try {
    decodedAdmin = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    res.json({
      error: e.message,
    });
    return;
  }
  if (decodedAdmin) {
    req.username = decodedAdmin.username;
    next();
  } else {
    res.json({
      message: "You are not logged in as an admin!",
    });
  }
}

function isUser(req, res, next) {
  let token = req.headers.token;
  let decodedUser;
  try {
    decodedUser = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    res.json({
      error: e.message,
    });
    return;
  }
  if (decodedUser) {
    req.username = decodedUser.username;
    next();
  } else {
    res.json({
      message: "You are not logged in as an user!",
    });
  }
}

module.exports = {
  isAdmin, isUser
};

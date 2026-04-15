const express = require("express");
const jwt = require("jsonwebtoken");
let JWT_SECRET = process.env.USER_SECRET;
let bcrypt = require("bcrypt");
let Router = express.Router();
let UserRouter = Router;
let { UserModel, CourseModel, PurchaseModel } = require("../db");
let { userMiddleware } = require("../middleware/user");

UserRouter.post("/signup", async function (req, res) {
  let { username, password } = req.body;
  let hashPass = await bcrypt.hash(password, 12);
  if (username && hashPass) {
    UserModel.create({
      username,
      password: hashPass,
    });
    res.json({
      message: "You are signed up!",
    });
  }
});

UserRouter.post("/login", async function (req, res) {
  let { username, password } = req.body;
  let user = await UserModel.findOne({ username });
  let verify = await bcrypt.compare(password, user.password);
  if (verify) {
    let token = jwt.sign(
      {
        username,
      },
      JWT_SECRET,
    );
    res.json({
      token,
      message: "You are logged in!",
    });
  } else {
    res.json({
      message: "Incorrect creds!",
    });
  }
});

UserRouter.get("/courses", async function (req, res) {
  let courses = await CourseModel.find({});
  res.json({ courses });
});

UserRouter.post(
  "/purchaseCourse/:courseId",
  userMiddleware,
  async function (req, res) {
    let { courseId } = req.params;
    let user = req.user;
    let course = await CourseModel.findOne({ _id: courseId });
    let user1 = await UserModel.findOne({ username: user.username });
    if (course) {
      PurchaseModel.create({
        courseId,
        userId: user1._id,
      });
      res.json({ message: "Purchase Successful!" });
    } else {
      res.json({ message: "Course doesn't exist!" });
    }
  },
);

UserRouter.get("/purchases", userMiddleware, async function (req, res) {
  let user = req.user;
  console.log(user);
  let isUser = await UserModel.findOne({ username: user.username });
  let courses = await PurchaseModel.find({ userId: isUser._id }).populate(
    "courseId",
  );
  if (courses.length) {
    res.json({
      courses,
    });
  } else {
    res.json({ message: "You don't have any courses!" });
  }
});

module.exports = {
  UserRouter,
};

const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const JWT_SECRET = process.env.ADMIN_SECRET;
let AdminRouter = Router;
const { AdminModel, CourseModel } = require("../db");
let { adminMiddleware } = require("../middleware/admin");

AdminRouter.post("/signup", async function (req, res) {
  let { username, password } = req.body;
  let hashPass = await bcrypt.hash(password, 12);
  if (username && hashPass) {
    AdminModel.create({
      username,
      password: hashPass,
    });
    res.json({
      message: "You are signed up!",
    });
  }
});

AdminRouter.post("/login", async function (req, res) {
  let { username, password } = req.body;
  let user = await AdminModel.findOne({ username });
  let verify = await bcrypt.compare(password, user.password)
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

AdminRouter.post("/createCourse", adminMiddleware, async function (req, res) {
  let { title, description, price } = req.body;
  let admin = req.admin;
  let isAdmin = await AdminModel.findOne({ username: admin.username });
  CourseModel.create({
    title,
    description,
    price,
    createdBy: isAdmin._id,
  });
  res.json({
    message: "Course created successfully!",
  });
});

AdminRouter.delete(
  "/deleteCourse/:courseId",
  adminMiddleware,
  async function (req, res) {
    let { courseId } = req.params;
    let admin = req.admin;
    let course = await CourseModel.findOne({ _id: courseId });
    let isAdmin = await AdminModel.findOne({ username: admin.username });
    if (course) {
      if (course.createdBy.toString() === isAdmin._id.toString()) {
        await CourseModel.deleteOne({ _id: courseId });
        res.json({
          message: "Course deleted!",
        });
      } else {
        res.json({
          message: "You can only delete your courses!",
        });
      }
    } else {
      res.json({ message: "Invalid courseId!" });
    }
  },
);

AdminRouter.put(
  "/addContent/:courseId",
  adminMiddleware,
  async function (req, res) {
    let { courseId } = req.params;
    let { title, description, price } = req.body;
    let admin = req.admin;
    let course = await CourseModel.findOne({ _id: courseId });
    let isAdmin = await AdminModel.findOne({ username: admin.username });
    if (course) {
      if (course.createdBy.toString() === isAdmin._id.toString()) {
        await CourseModel.updateOne(
          { _id: courseId },
          { $set: { title, description, price } },
        );
        res.json({
          message: "Course updated successfully!",
        });
      } else {
        res.json({ message: "You can only edit your courses!" });
      }
    } else {
      res.json({
        message: "Invalid CourseId!",
      });
    }
  },
);

module.exports = {
  AdminRouter,
};

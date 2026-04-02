require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET;
const { UserModel, AdminModel, CourseModel } = require("./db");
const { isAdmin, isUser } = require("./middlewares");
const { z } = require("zod");
const bcrypt = require("bcrypt");

mongoose.connect(process.env.MONGO_URL);

let User = z.object({
  username: z.string(),
  password: z.string(),
});

let Course = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
});

const app = express();
app.use(express.json());

// Admins
app.post("/admin/signup", async function (req, res) {
  let { username, password } = req.body;
  let inputs = User.safeParse(req.body);
  let hashPass = await bcrypt.hash(password, 10);
  if (inputs.success) {
    AdminModel.create({
      username,
      password: hashPass,
      isAdmin: true,
    });
    res.json({
      message: "You are signed up!",
    });
  } else {
    res.json({
      message: "Send correct inputs",
    });
  }
});

app.post("/admin/login", async function (req, res) {
  let { username, password } = req.body;
  let inputs = User.safeParse(req.body);
  if (inputs.success) {
    let response = await AdminModel.findOne({
      username,
    });
    let hashPass;
    if (response) {
      hashPass = await bcrypt.compare(password, response.password);
    } else {
      res.json({
        message: "Send correct creds",
      });
      return;
    }
    if (hashPass) {
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
        message: "Incorrect Creds",
      });
    }
  } else {
    res.json({
      message: "send correct inputs",
    });
  }
});

app.get("/admin/courses", isAdmin, async function (req, res) {
  let response = await CourseModel.find({});
  res.json({
    response,
  });
});

app.post("/admin/courses", isAdmin, async function (req, res) {
  let { title, description, price, image } = req.body;
  let inputs = Course.safeParse(req.body);
  if (inputs.success) {
    let response = await CourseModel.create({
      title,
      description,
      price,
      image,
    });
    res.json({
      response: response._id,
    });
  } else {
    res.json({
      message: "Send correct inputs",
    });
  }
});

// Users
app.post("/users/signup", async function (req, res) {
  let { username, password } = req.body;
  let inputs = User.safeParse(req.body);
  let hashPass = await bcrypt.hash(password, 10);
  if (inputs.success) {
    UserModel.create({
      username,
      password: hashPass,
      isAdmin: false,
    });
    res.json({
      message: "You are signed up!",
    });
  } else {
    res.json({
      message: "Send correct inputs",
    });
  }
});

app.post("/users/login", async function (req, res) {
  let { username, password } = req.body;
  let inputs = User.safeParse(req.body);
  if (inputs.success) {
    let response = await UserModel.findOne({
      username,
    });
    let hashPass;
    if (response) {
      hashPass = await bcrypt.compare(password, response.password);
    } else {
      res.json({
        message: "Incorrect creds",
      });
      return;
    }
    if (hashPass) {
      let token = jwt.sign(
        {
          username,
        },
        JWT_SECRET,
      );
      res.json({
        token,
        message: "You are logged in now!",
      });
    } else {
      res.json({
        message: "Incorrect creds",
      });
    }
  } else {
    res.json({
      message: "Send correct inputs",
    });
  }
});

app.get("/users/courses", async function (req, res) {
  let response = await CourseModel.find({});
  res.json({
    courses: response,
  });
});

app.post("/users/courses/:courseID", isUser, async function (req, res) {
  let username = req.username;
  let id = req.params.courseID;
  await UserModel.updateOne(
    {
      username,
    },
    {
      $push: {
        purchasedCourses: id,
      },
    },
  );
  res.json({
    message: "Purchased!",
  });
});

app.get("/users/purchasedCourses", isUser, async function (req, res) {
  let username = req.username;
  let response = await UserModel.findOne({ username });
  let arr = response.purchasedCourses;
  let courses = await CourseModel.find({
    _id: { $in: arr },
  });
  res.json({
    courses,
  });
});

app.listen(3000);

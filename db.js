const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
  purchasedCourses: [{ type: Schema.ObjectId, ref: "Course" }],
});

let Admin = new Schema({
  username: String,
  password: String,
  isAdmin: Boolean,
});

let Course = new Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
});

let UserModel = mongoose.model("users", User);
let AdminModel = mongoose.model("admin", Admin);
let CourseModel = mongoose.model("course", Course);

module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
};

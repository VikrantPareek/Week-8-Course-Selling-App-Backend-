const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
  },
});

const Admin = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    minLength: 3,
  },
  password: {
    type: String,
    required: true,
    minLength: 3,
  },
});

const Course = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 3,
  },
  description: {
    type: String,
    required: true,
    minLength: 3,
  },
  price: {
    type: Number,
    min: 1,
  },
  createdBy: {
    type: ObjectId,
    ref: "Admin",
  },
});

const Purchase = new Schema({
  courseId: {
    type: ObjectId,
    ref: "Course",
  },
  userId: {
    type: ObjectId,
    ref: "User",
  },
});

let UserModel = mongoose.model("User", User);
let AdminModel = mongoose.model("Admin", Admin);
let CourseModel = mongoose.model("Course", Course);
let PurchaseModel = mongoose.model("Purchase", Purchase);

module.exports = {
  UserModel,
  AdminModel,
  CourseModel,
  PurchaseModel,
};

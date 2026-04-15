require("dotenv").config();
const express = require("express");
const app = express();
const { UserRouter } = require("./Routes/user.js");
const { AdminRouter } = require("./Routes/admin.js");
const mongoose = require("mongoose");

app.use(express.json());
app.use("/user", UserRouter);
app.use("/admin", AdminRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

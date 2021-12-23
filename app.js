var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongodb = require("mongodb");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tasksRouter = require("./routes/tasks");
var app = express();

app.use(
  cors({
    origin: "*",
  })
);
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to Db"))
  .catch((err) => {
    console.error(err);
  });

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/tasks", tasksRouter);

module.exports = app;

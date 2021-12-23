var express = require("express");
var router = express.Router();
const uuid = require("uuid").v4;
const multer = require("multer");
var base64 = require("file-base64");
var path = require("path");
var Task = require("../models/Task");
var User = require("../models/User");
var fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${uuid()}-${originalname}`);
  },
});
const upload = multer({ storage });

router.post("/new", upload.single("file"), async (req, res, next) => {
  try {
    var newTask = {
      description: req.body.description,
      file: { path: req.file.path, name: req.file.originalname },
      category: req.body.category,
      user_id: req.body.user_id,
    };
    var task = await Task.create(newTask);
    var user = await User.findByIdAndUpdate(req.body.user_id, {
      $push: { tasks: task._id },
    });
    res.send({ task });
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  var user_id = req.params.id;
  try {
    let tasks = await User.findById(user_id).populate("tasks");
    res.send({ tasks });
  } catch (error) {
    next(error);
  }
});
router.put("/:taskid", upload.single("file"), async (req, res, next) => {
  var taskid = req.params.taskid;
  var newTask = {
    description: req.body.description,
    file: { path: req.file.path, name: req.file.originalname },
    category: req.body.category,
    user_id: req.body.user_id,
  };
  try {
    let task = await Task.findByIdAndUpdate(taskid, newTask);
    res.send({ task });
  } catch (error) {
    next(error);
  }
});
router.get("/find/:taskid", async (req, res, next) => {
  var taskid = req.params.taskid;
  try {
    let task = await Task.findById(taskid);
    res.send({ task });
  } catch (error) {
    next(error);
  }
});

router.delete("/:taskid", async (req, res, next) => {
  var taskid = req.params.taskid;
  try {
    let task = await Task.findByIdAndDelete(taskid).select("user_id");
    let user = await User.findByIdAndUpdate(task.user_id.valueOf(), {
      $pull: { tasks: taskid },
    });
    res.send({ task });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

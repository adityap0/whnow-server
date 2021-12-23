var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", async function (req, res, next) {
  req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
  req.body.username = Number(req.body.username);
  try {
    const user = await User.create(req.body);
    res.send(user);
  } catch (error) {
    next(error);
  }
});
router.post("/login", async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.send({
        error: {
          username: "User Not found",
        },
      });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({ user });
      } else {
        res.send({
          error: {
            password: "Incorrect Password",
          },
        });
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

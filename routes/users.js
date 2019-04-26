var express = require("express");
var router = express.Router();
const createError = require("http-errors");
const userModel = require("../models//user");
const bookModel = require("../models/Book");
const authMiddleware = require("../middlewares/User_Authentication");

router.post("/register", async function(req, res, next) {
  await userModel.create(req.body, function(err, user) {
    if (err) return next(createError(400, err.message));
    res.send(user);
  });
});

router.post("/login", async function(req, res, next) {
  const { name, password } = req.body;
  const currentUser = await userModel.findOne({ name });
  if (!currentUser) return next(createError(401));
  const passwordMatch = await currentUser.verifyPassword(password);
  if (!passwordMatch) return next(createError(401));
  const token = currentUser.generateToken();
  // console.log(token);
  // debugger;
  res.send({
    profile: currentUser,
    token
  });
});

router.use(authMiddleware);




module.exports = router;

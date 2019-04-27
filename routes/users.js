var express = require("express");
var router = express.Router();
const createError = require("http-errors");
const userModel = require("../models/user");
// const bookModel = require("../models/Book");
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

router.get("/profile", async function(req, res, next) {
  // debugger;
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      res.send(current);
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.get("/all-Books", async function(req, res, next) {
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      res.send(current.books);
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.get("/read-Books", async function(req, res, next) {
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      res.send(
        current.books.filter(book => {
          if (book.status === "read") return book;
        })
      );
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.get("/wanttoread-Books", async function(req, res, next) {
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      res.send(
        current.books.filter(book => {
          if (book.status === "want to read") return book;
        })
      );
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.get("/currentlyreading-Books", async function(req, res, next) {
  userModel
    .findById(req.user._id)
    .populate("books.bookId")
    .exec()
    .then(current => {
      res.send(
        current.books.filter(book => {
          if (book.status === "currently reading") return book;
        })
      );
    })
    .catch(err => {
      next(createError(404, err.message));
    });
});

router.post("/book/edit/:id", async function(req, res, next) {
  const { status, rate } = req.body;

  if (status) {
    req.user.books.find(book => {
      if (req.params.id == book.bookId._id.toString()) book["status"] = status;
    });
  }
  if (rate) {
    req.user.books.find(book => {
      if (book.bookId._id.toString() == req.params.id) book["rating"] = rate;
    });
  }
});

module.exports = router;

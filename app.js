var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
// var indexRouter = require("./routes/index");
const createError = require("http-errors");
require("./db");

var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
var authorsRouter = require("./routes/authors");
var booksRouter = require("./routes/books");
var categoriesRouter = require("./routes/categories");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", usersRouter);
app.use("/admin", adminRouter);
// app.use('/categories', categoriesRouter);
// app.use('/authors', authorsRouter);
// app.use('/books', booksRouter);

// not found middleware
app.use((req, res, next) => {
  next(createError(404, "Page not found"));
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;

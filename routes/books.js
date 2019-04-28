var express = require("express");
const createError = require("http-errors");
const CategoryModel = require("../models/Category");

var router = express.Router();

/* GET books listing. */
router.get("/", function(req, res, next) {
  Book.find({})
    .exec()
    .then(b => res.send(b))
    .catch(err => next(createError(500, err.message)));
});

router.get("/:bookId", (req, res, next) => {
  Book.findById(req.params.bookId)
    .populate("Authors")
    .then(book => res.send(book))
    .catch(err => next(createError(404, err.message)));
});

// router.post('/' , (req,res,next)=>{
//     debugger;
//     Book.create(req.body)

//     .then(book=>{
//         res.send(book);
//     })
//     .catch(err=>{
//         next(createError(400,err.message));
//     })
// })
router.post("/", async (req, res, next) => {
  const { categoryID } = req.body;
  const book = new Book(req.body);
  await res.send(book);
  book
    .save(req.body)
    .then(cat => {
      CategoryModel.updateOne({ _id: categoryID }, { $push: { books: cat._id } }).then();
    })
    .catch(err => next(createError(400, err.message)));
});

router.patch("/:bookId", (req, res, next) => {
  Book.findByIdAndUpdate(req.params.bookId, req.body, { new: true })
    .then(book => {
      res.send(book);
    })
    .catch(err => {
      next(createError(400, err.message));
    });
});

router.delete("/:bookId", (req, res, next) => {
  Book.findByIdAndDelete(req.params.bookId, req.body)
    .then(book => {
      res.send(book);
    })
    .catch(err => {
      next(createError(400, err.message));
    });
});

module.exports = router;

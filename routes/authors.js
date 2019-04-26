var express = require("express");
var router = express.Router();
const authMiddleware = require("./../middlewares/admin_Authentication");
const Author = require("../Models/AuthorModel");
const createError = require("http-errors");

//-------------------------------------------GetAll----------------------------------------------------------//
router.get("/GetAll", async function (req, res, next) {
    let author = await Author.find({}, function (error, data) {
        return data;
    });
    res.json(author);
});

/////// Authorization middleware Should be Here ///////////////////////
//-------------------------------------------Add----------------------------------------------------------//

router.post("/Add", function (req, res, next) {
    const author = new Author(req.body);
    author
        .save()
        .then(author => {
            res.send(author);
        })
        .catch(err => {
            next(createError(400, err.message));
        });
});

//-------------------------------------------Edit----------------------------------------------------------//

router.patch("/:id/edit", async function (req, res, next) {
    let author = await Author.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { new: true },
        (err, doc) => {
            if (err) {
                console.log("Something wrong when updating data!");
            }
        }
    );
    res.json(author);
});
 
//-------------------------------------------Delete----------------------------------------------------------//
router.delete("/:id/Delete", async function (req, res, next) {
    let author = await Author.findByIdAndDelete(req.params.id, function (
        error,
        data
        ) {
            if (error) {
                console.log(req.params.id);

            console.log("Something wrong when updating data!");
        }
    });
    res.json("Deleted success");
});

module.exports = router;

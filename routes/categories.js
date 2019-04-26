var express = require('express');
const Category = require('../models/Category');
const createError = require('http-errors');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    Category.find({})
  .exec()
  .then(categories=>res.send(categories))
  .catch(err=>next(createError(500,err.message)))
});
router.get('/:categoryId',(req,res,next)=>{
    Category.findById(req.params.categoryId)
    .populate('Books' , req.params._id)
    .then(category=>res.send(category))
    .catch(err=>next(createError(404,err.message)))
    })
router.post('/' , (req,res,next)=>{
    debugger;
    Category.create(req.body)
    .then(category=>{
        res.send(category);
    })
    .catch(err=>{
        next(createError(400,err.message));
    })
})

router.patch('/:categoryId' , (req,res,next)=>{
    Category.findByIdAndUpdate(req.params.categoryId, req.body ,{ new:true})
    .then(book=>{
        res.send(book);
    })
    .catch(err=>{
        next(createError(400,err.message));
    })
})

router.delete('/:categoryId' , (req,res,next)=>{
    Category.findByIdAndDelete(req.params.categoryId,req.body)
    .then(category=>{
        res.send(category);
    })
    .catch(err=>{
        next(createError(400,err.message));
    })
})

module.exports = router;
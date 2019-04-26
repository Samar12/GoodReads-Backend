const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 30
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "author"
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "category"
  },
  description: {
    type: String,
    required: [true, "description is required"]
  },
  photo: {
    type: String
  },
  avgRating: {
    type: String,
    default: "0"
  }
});
const bookModel = mongoose.model("book", bookSchema);

module.exports = bookModel;

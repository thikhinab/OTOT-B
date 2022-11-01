import mongoose from "mongoose"

const BookSchema = new mongoose.Schema({
  isbn13: {
    type: String,
    unique: true,
    trim: true,
    required: true,
    validate: {
      validator: function (val) {
        return val.length === 13 && /^\d+$/.test(val);
      },
      message: "ISBN13 should have only 13 numeric characters.",
    },
  },
  author: {
    type: String,
    requried: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", BookSchema);
export default Book;

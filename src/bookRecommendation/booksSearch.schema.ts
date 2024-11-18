import mongoose, { Schema, Document } from 'mongoose';


// Define the Book schema
const bookSearchSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  publishedDate: { type: Date, required: true },
  created_date: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
  tag_1:{ type: String, required: true },
  tag_2:{ type: String, required: true },

});

const BooksSearch = mongoose.model('books_search', bookSearchSchema);


export default BooksSearch


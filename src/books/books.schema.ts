import mongoose, { Schema, Document } from 'mongoose';


// Define the Book schema
const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  created_date: { type: Date, default: Date.now },
  updateDate: { type: Date, default: Date.now },
});

const Books = mongoose.model('Books', bookSchema);


export default Books


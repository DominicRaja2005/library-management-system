const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide author name'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'Please provide ISBN'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    trim: true
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please provide published year']
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    default: 1
  },
  available: {
    type: Number,
    required: true,
    default: 1
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index on ISBN for faster lookup
BookSchema.index({ isbn: 1 });
BookSchema.index({ title: 1 });

module.exports = mongoose.model('Book', BookSchema);
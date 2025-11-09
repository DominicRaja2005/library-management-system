import React, { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishedYear: '',
    quantity: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await booksAPI.getAllBooks();
      if (response.data.success) {
        setBooks(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingBook) {
        const response = await booksAPI.updateBook(editingBook._id, formData);
        if (response.data.success) {
          setSuccess('Book updated successfully!');
          fetchBooks();
          handleCloseModal();
        }
      } else {
        const response = await booksAPI.addBook(formData);
        if (response.data.success) {
          setSuccess('Book added successfully!');
          fetchBooks();
          handleCloseModal();
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const response = await booksAPI.deleteBook(id);
        if (response.data.success) {
          setSuccess('Book deleted successfully!');
          fetchBooks();
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      publishedYear: book.publishedYear,
      quantity: book.quantity
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publishedYear: '',
      quantity: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBook(null);
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      publishedYear: '',
      quantity: ''
    });
    setError('');
  };

  return (
    <div className="books-page">
      <div className="books-header">
        <h1>Library Books</h1>
        <button className="add-book-btn" onClick={handleAddNew}>
          + Add New Book
        </button>
      </div>

      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : books.length === 0 ? (
        <div className="loading">No books found. Add your first book!</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book._id} className="book-card">
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Category:</strong> {book.category}</p>
              <p><strong>Published:</strong> {book.publishedYear}</p>
              <p><strong>Available:</strong> {book.available} / {book.quantity}</p>
              <div className="book-actions">
                <button className="edit-btn" onClick={() => handleEdit(book)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(book._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="author">Author</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="isbn">ISBN</label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  required
                  disabled={editingBook}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="publishedYear">Published Year</label>
                <input
                  type="number"
                  id="publishedYear"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn">
                {editingBook ? 'Update Book' : 'Add Book'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
import React, { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await booksAPI.getAllBooks();
      if (response.data.success) {
        const books = response.data.data;
        const totalBooks = books.length;
        const availableBooks = books.reduce((sum, book) => sum + book.available, 0);
        const categories = [...new Set(books.map(book => book.category))].length;

        setStats({
          totalBooks,
          availableBooks,
          categories
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user.fullName || user.username}! 👋</h1>
        <p>Here's what's happening in your library today.</p>
      </div>

      {loading ? (
        <div className="loading">Loading statistics...</div>
      ) : (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Books</h3>
            <p>{stats.totalBooks}</p>
          </div>
          <div className="stat-card">
            <h3>Available Books</h3>
            <p>{stats.availableBooks}</p>
          </div>
          <div className="stat-card">
            <h3>Categories</h3>
            <p>{stats.categories}</p>
          </div>
        </div>
      )}

      <div className="dashboard-header" style={{ marginTop: '2rem' }}>
        <h2>Quick Actions</h2>
        <p>Manage your library efficiently with these tools:</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/books" style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#3498db', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px',
            marginRight: '1rem'
          }}>
            View All Books
          </a>
          <a href="/books" style={{ 
            display: 'inline-block', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#27ae60', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '4px'
          }}>
            Add New Book
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import './App.css';

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedUrl = originalUrl.trim();

    if (!trimmedUrl) {
      showToast('Please enter a URL', 'error');
      return;
    }

    setLoading(true);
    setShortUrl('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullUrl: trimmedUrl }),
      });

      const data = await response.json();

      if (response.ok && data.shortUrl) {
        setShortUrl(data.shortUrl);
        showToast('Short URL created!', 'success');
      } else {
        showToast(data.message || 'Something went wrong', 'error');
      }
    } catch (err) {
      console.error('Error:', err);
      showToast('Server error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    showToast('Copied to clipboard!', 'success');
  };

  return (
    <>
      <input type="checkbox" id="dark-toggle" hidden />
      <label htmlFor="dark-toggle" className="toggle-label" aria-label="Toggle dark mode">
        <svg className="toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" fill="currentColor" />
        </svg>
      </label>

      <div className="app">
        <div className="card">
          <h1>URL Shortener</h1>

          <form onSubmit={handleSubmit}>
            <input
              type="url"
              placeholder="Paste your long URL here"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
            <button type="submit" className="ripple-btn">
              {loading ? <span className="spinner"></span> : 'Shorten'}
            </button>
          </form>

          {shortUrl && (
            <div className="result">
              <input type="text" value={shortUrl} readOnly />
              <button onClick={handleCopy} className="ripple-btn">Copy</button>
            </div>
          )}
        </div>

        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      </div>
    </>
  );
}

export default App;

import React, { useState } from 'react';

const UrlShortenerForm = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      alert('Please enter a URL');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullUrl: url }), // ✅ correct key name
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Something went wrong');
        return;
      }

      // ✅ Construct full short URL
      const baseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      setShortUrl(`${baseUrl}/${data.shortUrl}`);
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to shorten"
      />
      <button type="submit">Shorten</button>

      {shortUrl && (
        <div>
          <p>Short URL:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </form>
  );
};

export default UrlShortenerForm;

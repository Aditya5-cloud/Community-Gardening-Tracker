// This file will automatically determine the correct API URL to use.
// In development, it will use localhost.
// In production (on Netlify), it will use the URL you set in your environment variables.

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export default API_URL;
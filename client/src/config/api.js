// API Configuration
// Uses environment variable in production, falls back to proxy in development
const API_URL = import.meta.env.VITE_API_URL || '';

// Configure axios base URL
import axios from 'axios';

if (API_URL) {
  axios.defaults.baseURL = API_URL;
}

export default axios;


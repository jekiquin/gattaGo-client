import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_SERVER;

//  Public API requests
export default axios.create({
  baseURL,
  headers: { 'ngrok-skip-browser-warning': '1234' },
});

//  Private API requests - send authorization header with access token
export const axiosPrivate = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '1234',
  },
});

//  Auth server requests
export const axiosAuth = axios.create({
  baseURL,
  headers: { 'ngrok-skip-browser-warning': '1234' },
});

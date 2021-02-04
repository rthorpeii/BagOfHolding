import axios from 'axios';

export const ApiClient = axios.create({
  // Production
  // baseURL: 'https://handy-haversack.herokuapp.com/api/',
  // Development
  baseURL: 'http://localhost:8080/api/',
});

export default ApiClient
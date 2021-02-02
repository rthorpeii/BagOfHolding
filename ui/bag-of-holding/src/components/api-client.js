import axios from 'axios';

export const ApiClient = axios.create({
  baseURL: 'https://handy-haversack.herokuapp.com/api/',
  timeout: 1000,
});

export default ApiClient
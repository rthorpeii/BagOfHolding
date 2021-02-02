import axios from 'axios';

export const ApiClient = axios.create({
  baseURL: 'https://handy-haversack.herokuapp.com:8080/api/',
  timeout: 1000,
});

export default ApiClient
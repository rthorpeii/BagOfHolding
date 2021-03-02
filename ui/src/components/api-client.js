import axios from 'axios';

export const ApiClient = axios.create({
  // Production
  // baseURL: 'https://handy-haversack.herokuapp.com/api/',
  
  // Development
  baseURL: 'http://localhost:8080/api/',

  headers: {'authorization': "bearer " + window.localStorage.getItem('authToken')}
});

export default ApiClient
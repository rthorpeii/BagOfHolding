import axios from 'axios';
var USER_API = process.env.NODE_ENV === 'production' ? 'https://handy-haversack.herokuapp.com/api/' : 'http://localhost:8080/api/'
export const ApiClient = axios.create({
  baseURL: USER_API,
  headers: {'Authorization': "Bearer " + window.localStorage.getItem('authToken')}
});

export default ApiClient
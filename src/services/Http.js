import axios from "axios";

const instance = axios.create({
  baseURL: API_BASE_URL || "http://localhost:3000/"
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

export default instance;

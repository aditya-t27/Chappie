import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080", // backend base URL
});

export default API;
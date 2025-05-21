// added to handle the difference in calls to api with container vs not 
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,

});

export default instance;

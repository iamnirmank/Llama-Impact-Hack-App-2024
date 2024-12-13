import axios,{AxiosInstance} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
    baseURL: "https://codevserver.azurewebsites.net/api/",
    // baseURL: "http://localhost:8000/api/",
});

export default axiosInstance;
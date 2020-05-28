import axios from 'axios';
import { config } from '../config';

const axiosInstance = axios.create({
    baseURL: config.API_URL,
    timeout: 5000,
    headers: {
        'Authorization': "JWT " + localStorage.getItem('access_token'),
        'Content-Type': 'application/json',
        'accept': 'application/json'
    }
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
        console.log(error);
        if (error.response.status === 401 && error.response.statusText === "Unauthorized") {
            const refresh_token = localStorage.getItem('refresh_token');
            try {
                const response = await axiosInstance
                    .post('/admin_app/token/refresh/', { refresh: refresh_token });
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                axiosInstance.defaults.headers['Authorization'] = "JWT " + response.data.access;
                originalRequest.headers['Authorization'] = "JWT " + response.data.access;
                return axiosInstance(originalRequest);
            }
            catch (err) {
                console.log(err);
            }
        }
      return Promise.reject(error);
  }
);
export default axiosInstance
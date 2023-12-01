import axios from 'axios';



const REST_URL = 'http://localhost:7000/api';


const apiService = axios.create({
    withCredentials: true,
    baseURL: REST_URL
});

apiService.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`;
    return config;
});

apiService.interceptors.response.use((config) => {
    return config;
}, 
 async (error) => {
   const request = error.config;
   if (error.response.status === 401 && !request._retry){
    try{
        request._retry = true;
        const response = await axios.get('http://localhost:7000/api/users/token/refresh', {withCredentials: true});
        localStorage.setItem('token', response.data.accessToken);
        return apiService(request);
    }
    catch(e){
        if (e.response.status === 401){
            localStorage.removeItem('token');
            window.location.replace('/account/login');
        }
    else throw e;
    }
   }
    throw error;
 }
)

export default apiService;
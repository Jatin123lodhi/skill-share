import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
})

// Request interceptor - adds token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config;
})

// Response interceptor - handles errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            // Unauthorized - clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error)
    }
)


export const fetchData = async ({
    method,
    url,
    payload
}: {
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    payload?: unknown
}) => {
    const response = await api.request({
        method,
        url,
        data: payload,
    })
    return response.data
}
import axios from "axios"

const url = `${import.meta.env.VITE_API_URL}/api`

const axiosInstance = axios.create({
    baseURL:url,
    withCredentials:true
})

export default axiosInstance
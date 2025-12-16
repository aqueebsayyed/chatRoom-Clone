import axiosInstance from "./url.service";

export const sendOtp = async (phoneNumber, phoneSuffix, email) => {
    try {
        const response = await axiosInstance.post("/auth/send-otp", { phoneNumber, phoneSuffix, email })
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const verifyOtp = async (identifier,otp)=>{
    try {
        const response = await axiosInstance.post("/auth/verify-otp",{identifier,otp})
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const getProfile = async () => {
    try {
        const response = await axiosInstance.get("/auth/get-profile")
        return response.data
    } catch (error) {
        console.error(error)
    }
}
export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/auth/get-all-user")
        return response.data
    } catch (error) {
        console.error(error)
    }
}

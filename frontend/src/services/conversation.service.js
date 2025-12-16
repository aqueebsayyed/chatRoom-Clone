import { useDispatch } from "react-redux"
import { setMessages } from "../redux/features/chatSlice"
import axiosInstance from "./url.service"



export const fetchConversation = async () => {
    try {
        const response = await axiosInstance.get("/chat/coversation")
        return response.data
    } catch (error) {
        console.error(error)
    }
}

export const fetchMessage = async (conversationId) => {
    try {
        const response = await axiosInstance.get(`/chat/coversation/${conversationId}`)
        return response.data
    } catch (error) {
        console.error(error)
    }
}
export const sendMessage = async (messageData) => {
    try {
        const response = await axiosInstance.post(`chat/send-message`,messageData,{
            headers:{"Content-Type": "application/json"}
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}



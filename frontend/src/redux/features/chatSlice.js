import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    conversations: [],
    messages: [],
    userStatus: [],
}

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        updateUserStatus: (state, action) => {
            const { userId, isOnline, lastSeen } = action.payload;
            const user = state.users.find((u) => u._id === userId);
            if (user) {
                user.isOnline = isOnline;
                user.lastSeen = lastSeen || user.lastSeen;
            } else {
                state.users.push({ _id: userId, isOnline, lastSeen });
            }
        }
    }
})

export const { setConversations, setMessages, addMessage, updateUserStatus } = chatSlice.actions

export default chatSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user: null,
    isAuthenticated: false,
    onlineUsers: {},
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
            state.isAuthenticated = !!action.payload
        },
        setUserStatus: (state, action) => {
            const { userId, status } = action.payload;
            state.onlineUsers[userId] = status;
        },
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
        }
    }
})

export const { setUser, logout,setUserStatus } = authSlice.actions

export default authSlice.reducer
import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    allUser:[],
    selectedContact:null
}

export const layoutSlice = createSlice({
    name:"layout",
    initialState,
    reducers:{
        setAllUsers: (state,action)=>{
            state.allUser = action.payload
        },
        setSelectedContact: (state,action)=>{
            state.selectedContact = action.payload
        },
    },
})
export const {setAllUsers,setSelectedContact} = layoutSlice.actions


export default layoutSlice.reducer
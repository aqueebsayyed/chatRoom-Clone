import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  step: 1,
}

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setStep: (state, action) => {
      state.step = action.payload
    },
  },
})

// Only export the action(s)
export const { setStep } = loginSlice.actions

// Export the reducer
export default loginSlice.reducer

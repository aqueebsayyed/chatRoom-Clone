import { configureStore, combineReducers } from "@reduxjs/toolkit"
import authSlice from "../features/authSlice"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storage from "redux-persist/lib/storage"
import  loginSlice  from "../features/loginSlice"
import layoutSlice from "../features/layoutSlice"
import chatSlice from "../features/chatSlice"

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth","layout"],   // persist only auth slice
}

const rootReducer = combineReducers({
  auth: authSlice,
  login:loginSlice,
  layout:layoutSlice,
  chat:chatSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

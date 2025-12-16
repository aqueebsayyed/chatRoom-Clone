// src/socket/socketServer.js
import { io } from "socket.io-client";
import {store} from "../redux/store/store.js";
import { updateUserStatus } from "../redux/features/chatSlice";

const socket = io(import.meta.env.VITE_API_URL, {
  withCredentials: true,
  transports: ["websocket"],
});

socket.on("user-presence", (data) => {
    console.log(data);
    
  // data = { userId, isOnline, lastSeen }
  store.dispatch(updateUserStatus(data));
});

socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
socket.on("disconnect", (reason) => console.log("❌ Socket disconnected:", reason));

export default socket;

// middlewares/socketAuth.js
const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")
const cookie = require("cookie");

module.exports.socketAuthMiddleware = async (socket, next) => {
  try {
    // const token = socket.handshake.cookie
    const cookies = socket.handshake.headers.cookie
      ? cookie.parse(socket.handshake.headers.cookie)
      : null;
    const token = cookies.auth_token // Assuming cookie name = "token"
    if (!token) {
      return next(new Error("Not Authorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);   
    // ✅ fetch user from your existing User model
    const user = await userModel.findById(decoded.userId).select("_id name email");
    if (!user) {
      return next(new Error("User not found"));
    }
    // attach user to socket
    socket.user = user;
    next();
  } catch (err) {
    console.log("Socket auth failed ->", err.message);
    next(new Error("Authentication error"));
  }
}

// module.exports = socketAuthMiddleware
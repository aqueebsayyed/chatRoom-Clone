const jwt = require("jsonwebtoken")
const response = require("../utility/responseHandler")

const authMiddleWear = (req, res, next) => {
    const token = req?.cookies?.auth_token || socket.handshake.headers?.cookie?.split("auth_token=")[1];
    if (!token) {
        return response(res, 404, "authprization token missing,Please provide token")
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error(error)
        return response(res, 500, "error with authmiddlewear token")
    }
}

module.exports = authMiddleWear
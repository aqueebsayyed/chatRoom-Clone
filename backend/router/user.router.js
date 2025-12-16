const express = require("express")
const router = express.Router()
const userController = require("../controller/user.controller")
const authMiddleWear = require("../middlewear/authMiddleWear")


router.post("/send-otp", userController.sendOtp)
router.post("/verify-otp", userController.verifyOtp)

// protected route
router.get("/get-profile", authMiddleWear, userController.getProfile)
router.get("/get-all-user", authMiddleWear, userController.getAllUser)

module.exports = router

const express = require("express")
const router = express.Router()
const authMiddleWear = require("../middlewear/authMiddleWear")
const chatController = require("../controller/chat.controller")

// protected route
router.post("/send-message",authMiddleWear,chatController.sendMessage)
router.get("/coversation",authMiddleWear,chatController.getConversation)
router.get("/coversation/:conversationId",authMiddleWear,chatController.getMessage)

module.exports = router

const mongoose = require("mongoose")


const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String
    },
    messageStatus: {
        type: String,
        default: 'send'
    }
}, { timestamps: true });

const messageModel = mongoose.model("Message", messageSchema)

module.exports = messageModel
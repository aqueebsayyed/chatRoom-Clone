const conversationModel = require("../models/conversation.model")
const messageModel = require("../models/message.model")
const response = require("../utility/responseHandler")

module.exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content, messageStatus } = req.body

        let participants = [senderId, receiverId]

        let conversation = await conversationModel.findOne({
            participants: { $all: participants }
        })

        if (!conversation) {
            conversation = await conversationModel.create({
                participants
            })
        }

        if (!content) {
            return response(res, 400, "Message Content Required")
        }

        const message = await messageModel.create({
            conversation: conversation._id,
            sender: senderId,
            receiver: receiverId,
            content,
            messageStatus
        })

        if (message.content) {
            conversation.lastMessage = message._id
        }

        await conversation.save()
        
        const populateMessage = await messageModel.findById(message?._id)
            .populate("sender", "username profilePicture")
            .populate("receiver", "username profilePicture")

        return response(res, 200, "Message Send Success", populateMessage)

    } catch (error) {
        console.log(error)
        return response(res, 500, "Internal Server error")
    }
}

module.exports.getConversation = async (req, res) => {
    try {
        const userId = req.user.userId;

        const conversations = await conversationModel.find({
            participants: userId
        }).populate("participants", "username profilePicture")
            .populate({
                path: "lastMessage",
                populate: {
                    path: "sender receiver",
                    select: "username profilePicture"
                }
            }).sort({ updatedAt: -1 })


        return response(res, 200, "Conversations fetched successfully", conversations);
    } catch (error) {
        console.error("getConversation Error:", error);
        return response(res, 500, "Internal Server Error");
    }
};

module.exports.getMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user.userId;

        const conversation = await conversationModel.findById(conversationId);

        if (!conversation) {
            return response(res, 400, "Conversation not found");
        }

        if (!conversation.participants.includes(userId)) {
            return response(res, 403, "You are not authorized to access this chat");
        }

        const messages = await messageModel
            .find({ conversation: conversationId })
            .populate("sender", "username profilePicture")
            .populate("receiver", "username profilePicture").lean();


        await messageModel.updateMany(
            {
                conversation: conversationId,
                receiver: userId,
                messageStatus: { $in: ["send", "delivered"] },
            },
            { $set: { messageStatus: "read" } }
        );

        return response(res, 200, "Messages retrieved successfully", messages);
    } catch (error) {
        console.error("getMessage Error:", error);
        return response(res, 500, "Internal Server Error");
    }
};

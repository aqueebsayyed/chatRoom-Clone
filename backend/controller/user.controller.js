const userModel = require("../models/user.model")
const response = require("../utility/responseHandler")
const emailOtpSend = require("../service/emailOtpSend");
const twiloService = require("../service/twiloService");
const otpSchema = require("../models/otp.model");
const generateToken = require("../utility/generateToken");
const conversationModel = require("../models/conversation.model");
// const redis = require("../service/redisService");

module.exports.sendOtp = async (req, res) => {
    const { phoneNumber, phoneSuffix, email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpire = Date.now() + 5 * 60 * 1000;

    try {
        let identifier = email || `${phoneSuffix}${phoneNumber}`

        if (!identifier) {
            return response(res, 404, "Email or PhoneNumber is required")
        }

        // let identifier;

        // if (email) {
        //     identifier = email;
        // } else {
        //     if (!phoneSuffix || !phoneNumber) {
        //         return res.status(400).json({ message: "Phone Number is required" });
        //     }
        //     identifier = `${phoneSuffix}${phoneNumber}`
        // }

        await otpSchema.findOneAndUpdate(
            { identifier },
            { otp, otpExpire },
            { upsert: true, new: true }
        )

        if (email) {
            await emailOtpSend(email, otp)
        } else {
            await twiloService.sendOtpToPhone(identifier, otp)
        }


        return response(res, 200, "OTP sent successfully")
    }
    catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error");
    }
};


module.exports.verifyOtp = async (req, res) => {
    try {
        const { identifier, otp } = req.body;
        console.log(identifier, otp)
        let isVerified = false;

        if (identifier.includes("@")) {
            const otpRecord = await otpSchema.findOne({ identifier });
            if (!otpRecord) {
                return response(res, 404, "OTP not found or expired");
            }
            if (otpRecord.otp !== otp) {
                return response(res, 400, "Invalid OTP");
            }

            isVerified = true;

            await otpSchema.deleteOne({ identifier });
        } else {
            try {
                isVerified = await twiloService.verifyOtpFromPhone(identifier, otp);
                if (!isVerified) {
                    return response(res, 400, "Invalid OTP");
                }
            } catch (error) {
                return response(res, 500, "Twilio OTP verification failed");
            }
        }
        let user = await userModel.findOne({
            $or: [{ email: identifier }, { phoneNumber: identifier }],
        });

        if (!user) {
            user = await userModel.create({
                email: identifier.includes("@") ? identifier : undefined,
                phoneNumber: !identifier.includes("@") ? identifier : undefined,
                isVerified: true,
            });
        } else {
            user.isVerified = true;
            await user.save();
        }

        const token = generateToken(user._id);
        res.cookie("auth_token", token, {
            httpOnly: true, // prevents client-side JS from reading the cookie
            maxAge: 1000 * 60 * 60 * 24 * 365
        })
        return response(res, 200, "OTP verified successfully", user);
    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal Server Error");
    }
};


module.exports.getProfile = async (req, res) => {
    try {
        const userId = req?.user?.userId
        if (!userId) {
            return response(res, 401, "userId not found, login first")
        }
        const user = await userModel.findById(userId);

        if (!user) {
            return response(res, 404, "user not found")
        }

    //  const isOnline = (await redis.exists(`online:${userId}`)) === 1;
    //  console.log(`User ${userId} is ${isOnline ? "online" : "offline"}`);

    //     const updateUser = {
    //         _id: user?.id,
    //         email: user.email,
    //         profilePicture: user.profilePicture,
    //         isVerified: user.isVerified,
    //         username: user.username,
    //         lastSeen: user.lastSeen,
    //         isOnline,
    //     }

        return response(res, 200, `Welcome Back ${user?.email}`, user)

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal server error")

    }
}


module.exports.getAllUser = async (req, res) => {
    try {
        const loggedInUser = req?.user?.userId

        const users = await userModel.find({ _id: { $ne: loggedInUser } }).select(
            "username profilePicture isVerified"
        ).lean()

        const userConversation = await Promise.all(
            users.map(async (user) => {
                const conversation = await conversationModel.findOne({
                    participants: { $all: [loggedInUser, user._id] }
                }).populate({
                    path: "lastMessage",
                    select: "content createdAt sender receiver"
                }).lean()

                return {
                    ...user,
                    conversation: conversation || null
                }
            })
        )
        // console.log(userConversation);

        return response(res, 200, "all user fetch success", userConversation)

    } catch (error) {
        console.log(error);
        return response(res, 500, "Internal server error")

    }
}


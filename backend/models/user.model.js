const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        sparse: true
    },
    phoneSuffix: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    profilePicture: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX4q0-hFsRa8s1kzziYZVHIW1zg-yH0S2POA&s"
    },
    username: { type: String },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: null
    },
    isOnline:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })

module.exports = mongoose.model("User", UserSchema);

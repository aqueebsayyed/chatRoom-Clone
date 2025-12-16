const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    identifier: { type: String, required: true },
    otp: { type: String, required: true },
    otpExpire: { type: Date, required: true }
},{ timestamps: true })

// TTL index: auto-delete after otpExpire
otpSchema.index({ otpExpire: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("otpstore", otpSchema);
const twillo = require("twilio")

const servicesid = process.env.TWILIO_SERVICE_SID   
const accountsid = process.env.TWILLO_ACCOUNT_SID
const authtoken = process.env.TWILLO_AUTH_TOKEN


const client = twillo(accountsid, authtoken)


const sendOtpToPhone = async (phoneNumber) => {
    try {
    console.log("sending otp to:", phoneNumber);
    if (!phoneNumber) {
        throw new Error("Phone number is required")
    }
    const response = await client.verify.v2.services(servicesid).verifications.create({
        to: phoneNumber,
        channel: "sms"
    })

       console.log("OTP sent successfully:", response.sid);

    return response
        } catch (error) {
        console.log(error);
        throw new Error("Twili Service send otp error")
        
    }
}
const verifyOtpFromPhone = async (phoneNumber, otp) => {
  try {
    if (!phoneNumber || !otp) {
      throw new Error("Phone number and OTP are required");
    }

    const response = await client.verify.v2
      .services(servicesid)
      .verificationChecks.create({
        to: phoneNumber, 
        code: otp,
      });

    if (response.status === "approved") {
      console.log("✅ OTP verified successfully");
      return true;
    } else {
      console.log("❌ OTP verification failed");
      return false;
    }
  } catch (error) {
    console.error("Twilio verifyOtpFromPhone error:", error.message);
    throw new Error("Twilio service failed to verify OTP");
  }
};


module.exports = {sendOtpToPhone,verifyOtpFromPhone}
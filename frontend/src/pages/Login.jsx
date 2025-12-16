import React from 'react'
import { useState } from 'react'
import Spinner from '../utilis/Spinner.jsx'
import { sendOtp, verifyOtp } from '../services/user.service.js'
import countries from "../utilis/countriles.js"
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setStep } from '../redux/features/loginSlice.js'
const Login = () => {
    // const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [selectedCountry, setSelectedCountry] = useState(countries[0])
    const [open, setOpen] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState("")
    const [fullPhoneNumber, setFullPhoneNumber] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [otpvalue, setOtpvalue] = useState("")
    const [loading, setLoading] = useState(false);
    const { step } = useSelector((state) => state.login)
    const dispatch = useDispatch()


    const handleSendOtp = async () => {
        try {
            setLoading(true)
            if (email) {
                const response = await sendOtp(null, null, email)
                console.log(response)
                if (response.status === "success") {
                    alert(response.message)
                    dispatch(setStep(2))
                }
            } else {
                const response = await sendOtp(phoneNumber, selectedCountry.dialCode, null)
                
                if (response.status === "success") {
                    setFullPhoneNumber(selectedCountry.dialCode+phoneNumber)
                    alert(response.message)
                    dispatch(setStep(2))
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleOtpChnge = (index, value) => {
        try {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)
            setOtpvalue(newOtp.join(""))
            if (value && index < otp.length - 1) {
                document.getElementById(`otp-${index + 1}`).focus();
            }

        } catch (error) {
            console.log(error);

        }
    }

    const handleOtpVerify = async () => {
        try {   
            if (email) {
                const response = await verifyOtp(email, otpvalue,)
                console.log(response);
                if (response.status === "success") {
                    dispatch(setStep(3))
                    alert(response.message)
                }
            } else {
                console.log(fullPhoneNumber);
                const response = await verifyOtp(fullPhoneNumber, otpvalue)
                console.log(response)
                if (response.status === "success") {
                    dispatch(setStep(3))
                    alert(response.message)
                }
            }

        } catch (error) {
            console.error(error)
        }
    }




    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">

                {step === 1 && (
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow p-8">
                        {/* Logo / Brand */}
                        <div className="flex items-center space-x-2 justify-center mb-6">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-800"></div>
                            <span className="text-gray-700 font-medium">fleeso</span>
                        </div>


                        {/* Phone Input */}
                        <div className="mb-4">
                            <div className="flex items-center border rounded-xl px-3 py-2">
                                <span className="flex items-center space-x-2">
                                </span>
                                <div className="relative w-36">
                                    {/* Selected box */}
                                    <div
                                        onClick={() => setOpen(!open)}
                                        className="flex items-center justify-between px-3 py-2  rounded-md bg-white cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2">
                                            <img src={selectedCountry.flag} alt="" />
                                            <span>{selectedCountry.dialCode}</span>
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {/* Dropdown */}
                                    {open && (
                                        <ul className="absolute left-0 w-full mt-1 bg-white border rounded-md shadow-md z-10">
                                            {countries.map((opt, i) => (
                                                <li
                                                    key={i}
                                                    onClick={() => {
                                                        setSelectedCountry(opt);
                                                        setOpen(false);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100"
                                                >
                                                    <img src={opt.flag} alt="" />
                                                    <span>{opt.dialCode}</span>
                                                    <span className="ml-auto text-gray-500">{opt.code}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <input
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    type="text"
                                    placeholder="Enter phone number"
                                    className="flex-1 ml-3 outline-none bg-transparent text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Signup with email */}
                        <div className="text-center mt-4">
                            Or <br /> Signup with email
                        </div>

                        <div className="mb-4 mt-4">
                            <div className="flex items-center border rounded-xl px-3 py-2">
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Enter EmailId"
                                    className="flex-1 ml-3 outline-none bg-transparent text-gray-700"
                                />
                            </div>
                        </div>

                        {/* Continue Button */}
                        <button onClick={handleSendOtp} className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                            {loading ? <Spinner /> : "Continue"}
                        </button>
                    </div>
                )}


                {step === 2 && (
                    <div className="bg-white w-full max-w-sm rounded-2xl shadow p-8">
                        {/* Logo / Brand */}
                        <div className="flex items-center space-x-2 justify-center mb-6">
                            <div className="w-4 h-4 rounded-full border-2 border-gray-800"></div>
                            <span className="text-gray-700 font-medium">fleeso</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-semibold text-center mb-2">
                            Enter OTP
                        </h2>
                        <p className="text-center text-gray-500 mb-6">
                            We’ve sent a 6-digit code to your phone
                        </p>

                        {/* OTP Inputs */}
                        <div className="flex justify-between mb-6">
                            {otp && otp.map((digital, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    value={digital}
                                    onChange={(e) => handleOtpChnge(index, e.target.value)}
                                    maxLength="1"
                                    className="w-10 h-12 border rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>

                        {/* Continue Button */}
                        <button onClick={handleOtpVerify} className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition">
                            Verify OTP
                        </button>

                        {/* Resend link */}
                        <div className="text-center mt-4">
                            <a href="#" className="text-gray-600 hover:underline">
                                Resend OTP
                            </a>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-green-500 p-6 text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-8 h-8 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-white">Account verified!</h1>
                        </div>

                        {/* Content Section */}
                        <div className="p-8 text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to fleeso</h2>
                            <p className="text-gray-600 mb-8">Your account has been successfully verified and is ready to use.</p>

                            {/* Dashboard Button */}
                            <Link to="/" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 transform hover:scale-105 cursor-pointer">
                                  Go to dashboard
                            </Link>

                            {/* Additional Options */}
                            <div className="mt-6 space-y-3">
                                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition duration-200">
                                    Explore features
                                </button>
                                <div className="block">
                                    <button className="text-gray-500 hover:text-gray-700 text-sm transition duration-200">
                                        Need help? Contact support
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}






            </div>
        </>
    )
}

export default Login
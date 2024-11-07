import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../Store/authStore';

const EmailVerificationPage = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const {error, isLoading, verifyEmail} = useAuthStore();

    const handleChange = (index, value, event) => {
        const newCode = [...code];

        if (event && event.clipboardData) { // Check for paste event
            const pastedData = event.clipboardData.getData("Text").slice(0, 6);
            if (pastedData.length === 6) {
                const splitCode = pastedData.split("");
                setCode(splitCode);
                splitCode.forEach((char, i) => {
                    newCode[i] = char;
                });
                setCode(newCode);

                // Focus the last filled input
                inputRefs.current[5].focus();
                return;
            }
        }

        // Normal character input handling
        newCode[index] = value;
        setCode(newCode);

        // Move focus to the next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("Email verified successfully!");
        } catch (error) {
            console.log(error);
        }
    };

    // Auto-submit when all inputs are filled
    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit({ preventDefault: () => {} }); // Mock event to prevent default form behavior
        }
    }, [code]);

    return (
        <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Verify your Email
                </h2>
                <p className="text-center text-gray-300 mb-6">
                    Enter the 6-digit code sent to your email address.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between">
                        {code.map((digit, index) => (
                            <motion.input
                                type="text"
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value, e)}
                                onPaste={(e) => handleChange(index, e.target.value, e)} // Handle paste event
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-400 rounded-lg focus:border-green-500 focus:outline-none"
                            />
                        ))}
                    </div>

                    {error && <p className=" text-red-500 font-semibold mt-2">{error}</p>}

                    <motion.button
                        className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader className="animate-spin mx-auto" /> : "Verify Email"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default EmailVerificationPage;

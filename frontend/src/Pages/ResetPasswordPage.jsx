import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../Store/authStore';
import Input from '../components/Input';
import { Lock, ArrowLeft, Loader } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { resetPassword, isLoading, error, message } = useAuthStore();
    const { token } = useParams();
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await resetPassword(token, password);
            setIsSubmitted(true);
            setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
        } catch (err) {
            console.error("Failed to reset password:", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
            <div className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                    Reset Password
                </h2>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <p className="text-gray-200 mb-6 text-center">
                            Enter a new password to reset your account.
                        </p>
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            icon={Lock}
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <motion.button
                            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader className="size-6 animate-spin mx-auto" /> : "Reset Password"}
                        </motion.button>
                    </form>
                ) : (
                    <div className="text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                        >
                            <Lock className="h-8 w-8 text-white" />
                        </motion.div>
                        <p className="text-gray-300 mb-6">
                            Password has been reset successfully. Redirecting to login page...
                        </p>
                    </div>
                )}
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
                <Link to={'/login'} className="text-sm text-green-400 hover:underline flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
                </Link>
            </div>
        </motion.div>
    );
};

export default ResetPasswordPage;

import { User } from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import crypto from "crypto";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { sendResetPasswordEmail, sendResetPasswordSuccessEmail, sendVerificationEmail, sendWelcomEmail } from '../mailtrap/email.js';

export const signup = async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Generate verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new user
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // Generate JWT and set it as cookie
        generateTokenAndSetCookie(res, user._id);

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
            success: true,
            message: "User created successfully. Please verify your email.",
            user: {
                ...user._doc,
                password: undefined, // Remove password from response
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        // Find user by verification code and check if code has expired
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code",
            });
        }

        // Update user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Server error",
        });
    }
};

export const login = async (req, res) => { 
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                success : false,
                message : "Invalid email or password",
            })
        }
        const isValidPassword = await bcryptjs.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        // Generate JWT and set it as cookie
        generateTokenAndSetCookie(res, user._id)
        user.lastlogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })



    }catch (error){
        console.log("error in login", error);
        res.status(500).json({success: false, message: error.message});
    }
};

export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    })
};

export const forgotPassword = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({
                success : false,
                message: "User not found",
            })
        };

        // Generate reset token 

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1*60*60*1000;

        user.resetPasswordToken = resetToken 
        user.resetPasswordExpiresAt = resetTokenExpiresAt

        await user.save();

        // Send reset password email

        await sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({
            success: true,
            message: "Reset password email sent successfully",
        })
    }catch (error){
        console.log("error in forgot password", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const resetPassword = async (req, res) => {
    try{
        const { token } = req.params;
        const {password} = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() },
        }); 

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password reset token",
            });
        }

        //update password

        const hashedPassword = await bcryptjs.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetPasswordSuccessEmail(user.email);

        return res.status(200).json({ 
            success : true,
            message: "Password reset successfully" 
        });
    }catch (error){
        console.log("error in reset password", error);
        res.status(500).json({success: false, message: error.message});
    }
};

export const checkAuth = async (req, res) => { 
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error, please try again later."  
        });
    }
};


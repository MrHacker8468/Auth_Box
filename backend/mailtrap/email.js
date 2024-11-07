import { PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplates.js';
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from './emailTemplates.js';
import { VERIFICATION_EMAIL_TEMPLATE } from './emailTemplates.js';
import { mailtrapClient, sender } from './mailtrap.config.js';

export const sendVerificationEmail = async (recipientEmail, verificationToken) => {
    const recipient = [{ email: recipientEmail }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification",
        });

        console.log("Mail sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};


export const sendWelcomEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            template_uuid: "b0f19694-9fd6-471f-a951-a51fec8d1757",
            template_variables: {
                "company_info_name": "Auth_learning Application",
                "name": name
            }  
        });

        console.log(" Welcome Email sent successfully:", response);
    } catch (error) {
        console.error("Welcome Error sending email:", error);
        throw new Error(`Welcome Error sending verification email: ${error.message}`);
    }
};

export const sendResetPasswordEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password Reset",
        })
    }catch (error){
        console.error("Error sending password reset email:", error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
}

export const sendResetPasswordSuccessEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset Password Successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset Success",
        });

        console.log("Password reset Email sent successfuly", response);
    }catch (error){
        console.error("Error sending password reset email:", error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
}
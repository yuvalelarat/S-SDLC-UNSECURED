import nodemailer from 'nodemailer';
import User from "../models/userModel.js";
import { AppDataSource } from '../config/data-source.js';

export async function sendEmail(to, tempPass) {
    console.log(`[sendEmail] Preparing to send email to: ${to}`);

    if (!to || !tempPass) {
        console.error(`[sendEmail] Missing required parameters: to=${to}, tempPass=${tempPass}`);
        return { success: false, status: 400, message: 'Missing required parameters' };
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: to } });

    if (!user) {
        console.error(`[sendEmail] User not found for email: ${to}`);
        return { success: false, status: 404, message: 'Email not found' };
    }

    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error(`[sendEmail] Missing email credentials in environment variables`);
        return { success: false, status: 500, message: 'Missing email configuration' };
    }

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: 'Password Reset Token',
        text: `Use this token to reset your password: ${tempPass}`
    };

    try {
        console.log(`[sendEmail] Sending email to ${to}`);
        await transporter.sendMail(mailOptions);
        console.log(`[sendEmail] Email successfully sent to: ${to}`);
        return { success: true };
    } catch (error) {
        console.error(`[sendEmail] Failed to send email:`, error);
        return { success: false, status: 500, message: 'Failed to send email' };
    }
}
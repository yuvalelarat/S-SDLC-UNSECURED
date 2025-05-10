import { log } from 'console';
import nodemailer from 'nodemailer';

export async function sendEmail(to, tempPass) {
    console.log(`[sendEmail] Preparing to send email to: ${to}`);

    const { EMAIL_USER, EMAIL_PASS } = process.env;

    if (!EMAIL_USER || !EMAIL_PASS) {
        console.error(`[sendEmail] Missing environment variables for email configuration.`);
        throw new Error('Missing email configuration');
    }
    
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: EMAIL_USER,
        to:to,
        subject: 'Password Reset Token',
        text: `Use this token to reset your password: ${tempPass}`
    };

    try {
        console.log(`[sendEmail] Sending email with token: ${tempPass}`);
        await transporter.sendMail(mailOptions);
        console.log(`[sendEmail] Email successfully sent to: ${to}`);
    } catch (error) {
        console.error(`[sendEmail] Failed to send email to ${to}:`, error);
        throw error;
    }
}

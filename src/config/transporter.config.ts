import dotenv from 'dotenv';
import { createTransport } from "nodemailer";
import { MailtrapTransport } from "mailtrap";
dotenv.config();

const transporter = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

export default transporter;
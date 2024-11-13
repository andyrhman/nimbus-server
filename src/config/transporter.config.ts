import { createTransport } from "nodemailer";

const transporter = createTransport({
    host: '192.168.1.7', // * Windows IP running this on wsl
    port: 1025
    // host: process.env.SMTP_HOST,
    // port: parseInt(process.env.SMTP_PORT, 10),
    // auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    // }
});

export default transporter;
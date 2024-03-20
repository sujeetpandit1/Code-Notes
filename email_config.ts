// import nodemailer from 'nodemailer';
import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()

var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.EMAIL_USER;  //"50e0db0ac8c6b6",
      pass: process.env.PASSWORD; //"ed5ab3fd1194b2"
    }
  });

export const send_email = async (to: string, subject: string, text: string): Promise<void> => {
    try {
      await transport.sendMail({
        from: process.env.EMAIL_USER, // Use the same user for "from" field
        to,
        subject,
        text,
      });
    } catch (error) {
      throw new Error(`Failed to send email: ${error}`);
    }
  };